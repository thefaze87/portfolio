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
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const GENERIC_ERROR =
  "Something went wrong sending your message. Try again, or email me directly and I'll pick it up.";

/** Resolve the client IP from the hosting proxy headers. */
async function getClientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return `contact:${ip}`;
}

export async function submitContact(values: ContactFormValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !(key in fieldErrors)) {
        fieldErrors[key as keyof ContactFormValues] = issue.message;
      }
    }
    return { ok: false, error: 'Check the highlighted fields and try again.', fieldErrors };
  }

  const data = parsed.data;

  // Honeypot tripped. Report success so bots get no signal to adapt to.
  if (data.website) return { ok: true };

  const { allowed, retryAfter } = checkRateLimit(await getClientKey(), RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
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

  if (!apiKey) {
    // Misconfiguration, not user error. Loud in logs, generic to the visitor.
    console.error('[contact] Missing env: resend_api');
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
    const { error } = await resend.emails.send({
      from: NOTIFICATION_FROM,
      to: INBOX,
      replyTo: data.email,
      subject: `New website inquiry — ${data.name}`,
      html: await render(<ContactNotification {...notificationProps} />),
      text: contactNotificationText(notificationProps),
    });

    if (error) {
      // The message did not reach Mark. Saying "sent" here would be a lie the
      // visitor cannot detect, so this is a hard failure.
      console.error('[contact] Notification failed:', error);
      return { ok: false, error: GENERIC_ERROR };
    }

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

      const { error: ackError } = await resend.emails.send({
        from: ACKNOWLEDGEMENT_FROM,
        to: data.email,
        replyTo: INBOX,
        subject: "Thanks for reaching out — I'll be in touch soon",
        html: await render(<ContactAcknowledgement {...acknowledgementProps} />),
        text: contactAcknowledgementText(acknowledgementProps),
      });
      if (ackError) console.error('[contact] Acknowledgement failed:', ackError);
    } catch (ackCause) {
      console.error('[contact] Acknowledgement threw:', ackCause);
    }

    return { ok: true };
  } catch (cause) {
    console.error('[contact] Unexpected failure:', cause);
    return { ok: false, error: GENERIC_ERROR };
  }
}
