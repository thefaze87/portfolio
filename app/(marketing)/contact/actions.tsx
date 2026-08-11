'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { checkRateLimit } from '@/lib/rate-limit';
import { ACKNOWLEDGEMENT_FROM, INBOX, NOTIFICATION_FROM } from '@/lib/email.server';
import {
  ContactNotification,
  contactNotificationText,
  type ContactNotificationProps,
} from '@/emails/ContactNotification';
import {
  ContactAcknowledgement,
  contactAcknowledgementText,
  type ContactAcknowledgementProps,
} from '@/emails/ContactAcknowledgement';
import { contactSchema, type ContactFormValues, type ContactResult } from '@/lib/schemas/contact';

/**
 * Contact Server Action.
 *
 * Why an action rather than a route handler: the Zod schema is imported by
 * both the client resolver and this module, so the contract cannot drift;
 * there's no public JSON endpoint to discover and hammer; and no fetch
 * boilerplate to keep in sync with the form.
 *
 * Security posture:
 *   - `resend_api` is read here, in server-only code. It is never imported
 *     into a Client Component and never reaches the browser bundle.
 *   - The payload is re-validated server-side. Client validation is UX.
 *   - Honeypot submissions return `{ ok: true }` — bots are told nothing.
 *   - Rate limited per IP (see lib/rate-limit.ts for its real limitations).
 *   - Error messages returned to the client are generic; the underlying cause
 *     is logged server-side only.
 *
 * ## Observability
 *
 * The generic error is deliberately uninformative, which makes a production
 * failure invisible from the browser — by design, and the reason the log side
 * has to carry the whole diagnosis. Every path emits one JSON line tagged
 * `scope:"contact"` with a shared `submissionId`. See the diagnostics block
 * below for what is and is not recorded.
 *
 * The contract is one-way: nothing added to a log line may ever be added to a
 * returned `ContactResult`. If a future change wants to tell the visitor *why*
 * something failed, that is a UX decision to make deliberately, not a side
 * effect of improving logging.
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const GENERIC_ERROR =
  "Something went wrong sending your message. Try again, or email me directly and I'll pick it up.";

/* ============================================================================
 * Structured diagnostics
 *
 * Everything here goes to the server log and nowhere else. The value returned
 * to the browser is GENERIC_ERROR in every failure path — these logs exist
 * because that generic message is deliberately uninformative, which makes a
 * production failure impossible to diagnose from the outside.
 *
 * One line per event, JSON-encoded, so Vercel's log viewer parses it into
 * filterable fields instead of a wall of text. Every line carries the same
 * `submissionId`, so one submission's whole story can be pulled up with a
 * single filter even when requests interleave.
 *
 * ## What is never logged
 *
 * The API key's value. `describeApiKey` reports only presence, length, and
 * whether the format looks right — enough to tell "unset" from "set to the
 * wrong thing" from "set with a stray newline", without ever putting the
 * secret in a log aggregator.
 *
 * ## What is logged, deliberately
 *
 * The visitor's email address, as sender/recipient. It is already in the
 * message body being delivered, and without it a delivery failure cannot be
 * traced to the person who hit the error. Note it is PII: if a log retention
 * policy is ever written, these lines are in scope.
 * ========================================================================== */

type LogFields = Record<string, unknown>;

function logEvent(level: 'info' | 'error', event: string, fields: LogFields): void {
  // Single-line JSON: Vercel groups multi-line output as separate log entries,
  // which would split one failure across several rows.
  const line = JSON.stringify({ scope: 'contact', event, ...fields });
  if (level === 'error') console.error(line);
  else console.log(line);
}

/**
 * Describe the API key without revealing it.
 *
 * Length and prefix are the two things that distinguish the failure modes that
 * look identical from the outside: a missing variable, a variable pasted with
 * surrounding quotes or a trailing newline (a very common Vercel paste error —
 * the key is "present" but every request 401s), and a key from the wrong
 * account. `re_` is Resend's public key prefix, not a secret.
 */
function describeApiKey(raw: string | undefined): LogFields {
  if (raw === undefined) return { hasResendKey: false, keyIssue: 'env-var-undefined' };
  if (raw === '') return { hasResendKey: false, keyIssue: 'env-var-empty-string' };

  const trimmed = raw.trim();
  return {
    hasResendKey: true,
    keyLength: raw.length,
    keyPrefixValid: trimmed.startsWith('re_'),
    // Any of these means the variable holds something other than the bare key.
    keyHasSurroundingWhitespace: trimmed.length !== raw.length,
    keyHasQuotes: /^["']|["']$/.test(trimmed),
  };
}

/**
 * Flatten a Resend SDK error or a thrown value into loggable fields.
 *
 * The SDK resolves with `{ data, error }` rather than throwing for API-level
 * failures, so the interesting cases arrive as a plain object with `name`,
 * `message`, and sometimes `statusCode`. Unknown shapes are stringified rather
 * than dropped — an unrecognised error is exactly when the raw value matters.
 */
function describeFailure(cause: unknown): LogFields {
  if (cause instanceof Error) {
    return {
      errorName: cause.name,
      errorMessage: cause.message,
      stack: cause.stack,
      ...(cause.cause === undefined ? {} : { errorCause: String(cause.cause) }),
    };
  }

  if (cause && typeof cause === 'object') {
    const record = cause as Record<string, unknown>;
    return {
      errorName: record.name ?? 'ResendError',
      errorMessage: record.message ?? null,
      // Resend's status code is the fastest read on root cause: 401 invalid
      // key · 403 domain not verified · 422 invalid payload · 429 rate limit.
      statusCode: record.statusCode ?? record.status ?? null,
      raw: safeStringify(record),
    };
  }

  return { errorName: 'UnknownError', raw: String(cause) };
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    // Circular reference or a non-serializable field — never let a logging
    // helper be the thing that throws inside a catch block.
    return String(value);
  }
}

/**
 * Request-scoped identifiers.
 *
 * `x-vercel-id` is the platform's own request id and is the value that ties a
 * log line to a specific invocation in the Vercel dashboard. It is absent
 * locally, which is why `submissionId` exists as well — a self-generated
 * correlation id that works in every environment.
 */
async function getRequestContext(): Promise<{
  clientKey: string;
  requestId: string | null;
  deployment: string | null;
}> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';

  return {
    clientKey: `contact:${ip}`,
    requestId: h.get('x-vercel-id'),
    deployment: process.env.VERCEL_ENV ?? null,
  };
}

export async function submitContact(values: ContactFormValues): Promise<ContactResult> {
  // Correlates every log line for this submission. Generated before any work
  // so even the earliest rejection is traceable.
  const submissionId = crypto.randomUUID().slice(0, 8);
  const startedAt = Date.now();

  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !(key in fieldErrors)) {
        fieldErrors[key as keyof ContactFormValues] = issue.message;
      }
    }
    logEvent('info', 'validation_rejected', {
      submissionId,
      fields: Object.keys(fieldErrors),
    });
    return { ok: false, error: 'Check the highlighted fields and try again.', fieldErrors };
  }

  const data = parsed.data;

  // Honeypot tripped. Report success so bots get no signal to adapt to.
  if (data.website) {
    logEvent('info', 'honeypot_discarded', { submissionId });
    return { ok: true };
  }

  const { clientKey, requestId, deployment } = await getRequestContext();
  const { allowed, retryAfter } = checkRateLimit(clientKey, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    logEvent('info', 'rate_limited', { submissionId, requestId, retryAfter });
    const minutes = Math.max(1, Math.ceil(retryAfter / 60));
    return {
      ok: false,
      error: `That's a few messages in a short window. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    };
  }

  // Addresses are configuration (lib/email.server.ts), not environment
  // variables — only the API key is a secret. That removes a deployment step
  // that could silently produce a form which appears to work and delivers
  // nowhere.
  //
  // The variable is lowercase because that is the name already provisioned in
  // Vercel. Case matters: process.env is case-sensitive on Linux, so
  // RESEND_API_KEY would read undefined in production.
  const apiKey = process.env.resend_api;
  const keyDiagnostics = describeApiKey(apiKey);

  // Emitted before every send attempt, success or failure, so a working
  // submission and a broken one produce comparable evidence. Without a
  // baseline from a healthy request there is nothing to diff a failure
  // against.
  logEvent('info', 'send_attempt', {
    submissionId,
    requestId,
    deployment,
    notificationFrom: NOTIFICATION_FROM,
    notificationTo: INBOX,
    notificationReplyTo: data.email,
    notificationSubject: `New website inquiry — ${data.name}`,
    acknowledgementFrom: ACKNOWLEDGEMENT_FROM,
    acknowledgementTo: data.email,
    ...keyDiagnostics,
  });

  if (!apiKey) {
    // Misconfiguration, not user error. Loud in logs, generic to the visitor.
    logEvent('error', 'config_missing', {
      submissionId,
      requestId,
      deployment,
      ...keyDiagnostics,
      hint: 'Set `resend_api` (lowercase) for this environment in Vercel, then redeploy — env changes do not apply to existing deployments.',
    });
    return { ok: false, error: GENERIC_ERROR };
  }

  try {
    // Constructed per-request, not at module scope, so a missing key at build
    // time can never throw during static generation.
    const resend = new Resend(apiKey);

    const notificationProps: ContactNotificationProps = {
      name: data.name,
      email: data.email,
      company: data.company,
      role: data.role,
      projectType: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
      message: data.message,
      receivedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/New_York',
      }),
    };

    // ------------------------------------------------------------------
    // 1. Internal notification — CRITICAL.
    //
    // Sent from notifications@ so a reply to machine mail never lands
    // somewhere unmonitored; Reply-To is the visitor, so hitting reply in the
    // inbox answers them directly.
    //
    // Both html and text are sent. A text/plain part is not optional courtesy:
    // HTML-only mail scores worse with spam filters and renders as nothing in
    // text-only clients.
    // ------------------------------------------------------------------
    const notificationSubject = `New website inquiry — ${data.name}`;
    const { data: notificationResult, error } = await resend.emails.send({
      from: NOTIFICATION_FROM,
      to: INBOX,
      replyTo: data.email,
      subject: notificationSubject,
      html: await render(<ContactNotification {...notificationProps} />),
      text: contactNotificationText(notificationProps),
    });

    if (error) {
      // The message did not reach Mark. Saying "sent" here would be a lie the
      // visitor cannot detect, so this is a hard failure.
      logEvent('error', 'notification_failed', {
        submissionId,
        requestId,
        deployment,
        from: NOTIFICATION_FROM,
        to: INBOX,
        replyTo: data.email,
        subject: notificationSubject,
        durationMs: Date.now() - startedAt,
        ...keyDiagnostics,
        ...describeFailure(error),
      });
      return { ok: false, error: GENERIC_ERROR };
    }

    logEvent('info', 'notification_sent', {
      submissionId,
      requestId,
      // Resend's message id. This is the value to paste into the Resend
      // dashboard to see delivery, bounce, and complaint status for this
      // specific message — the API accepting it is not the same as an inbox
      // receiving it.
      messageId: notificationResult?.id ?? null,
      durationMs: Date.now() - startedAt,
    });

    // ------------------------------------------------------------------
    // 2. Visitor acknowledgement — SECONDARY.
    //
    // Deliberately isolated: the message already reached Mark, so a bounce
    // here must not fail the visitor's submission. Logged, never surfaced.
    // ------------------------------------------------------------------
    try {
      const acknowledgementProps: ContactAcknowledgementProps = {
        // First token only. "Hi Dr. Sarah Chen-Williams," reads worse than
        // "Hi Dr.," would — but a full name reads as a mail merge, and this
        // email's entire job is sounding like a person wrote it.
        firstName: data.name.trim().split(/\s+/)[0] ?? data.name,
        message: data.message,
        company: data.company,
        projectType: data.projectType,
        timeline: data.timeline,
      };

      const acknowledgementSubject = "Thanks for reaching out — I'll be in touch soon";
      const { data: ackResult, error: ackError } = await resend.emails.send({
        from: ACKNOWLEDGEMENT_FROM,
        to: data.email,
        replyTo: INBOX,
        subject: acknowledgementSubject,
        html: await render(<ContactAcknowledgement {...acknowledgementProps} />),
        text: contactAcknowledgementText(acknowledgementProps),
      });

      if (ackError) {
        logEvent('error', 'acknowledgement_failed', {
          submissionId,
          requestId,
          from: ACKNOWLEDGEMENT_FROM,
          to: data.email,
          subject: acknowledgementSubject,
          ...describeFailure(ackError),
        });
      } else {
        logEvent('info', 'acknowledgement_sent', {
          submissionId,
          requestId,
          messageId: ackResult?.id ?? null,
        });
      }
    } catch (ackCause) {
      logEvent('error', 'acknowledgement_threw', {
        submissionId,
        requestId,
        to: data.email,
        ...describeFailure(ackCause),
      });
    }

    logEvent('info', 'submission_ok', {
      submissionId,
      requestId,
      durationMs: Date.now() - startedAt,
    });
    return { ok: true };
  } catch (cause) {
    // Reached only for a throw the SDK did not convert into `{ error }` —
    // a network fault, a DNS failure, or a bug in the render step.
    logEvent('error', 'unexpected_failure', {
      submissionId,
      requestId,
      deployment,
      durationMs: Date.now() - startedAt,
      ...keyDiagnostics,
      ...describeFailure(cause),
    });
    return { ok: false, error: GENERIC_ERROR };
  }
}
