/**
 * Public email configuration and mailto composition.
 *
 * ## What belongs here
 *
 * Public, non-secret addresses only. These are routing aliases that all land
 * in the same mailbox; they exist so inbound mail can be filtered by intent
 * and so the address a visitor sees matches why they are writing.
 *
 * **The real inbox is deliberately NOT in this file.** `lib/email.server.ts`
 * holds it, because anything exported from here can be imported by a Client
 * Component and shipped to the browser. Keeping the private address in a
 * separate module makes accidental exposure a visible import rather than an
 * invisible one.
 *
 * These are configuration, not secrets, so they are not environment
 * variables — only RESEND_API_KEY is. Putting a public address behind an env
 * var buys nothing and adds a deployment step that can silently be missed.
 */

export const EMAIL = {
  /** General-purpose public address. Footer, contact page, acknowledgements. */
  public: 'hello@markfasel.dev',
  /** Consulting-intent inquiries. */
  consulting: 'consulting@markfasel.dev',
  /** Recruiter / employment inquiries. */
  opportunities: 'opportunities@markfasel.dev',
  /** Application-generated operational mail. Never a human reply address. */
  notifications: 'notifications@markfasel.dev',
} as const;

/**
 * Aliases that exist at the mailbox level but are not wired into the UI.
 *
 * Recorded here so the routing story lives in one place, and so a future
 * surface (a /speaking page, a press kit) has an obvious address to reach for
 * rather than inventing one. Deliberately not rendered anywhere today —
 * exposing an address with no matching page invites mail nobody is expecting.
 */
/**
 * The two-role signature line used in email. Shorter than the site's four-role
 * SITE_ROLE, which wraps awkwardly at email widths and reads as a list rather
 * than a signature.
 */
export const SITE_ROLE_SHORT = 'Solutions Architect · AI Strategist';

/**
 * Scheduling link, rendered in the email footer when set.
 *
 * Empty today: no Calendly account is configured. Surfaces check for a value
 * before rendering, so an unset link produces no row rather than a dead one —
 * the same gating discipline as `published` in lib/nav.ts. Paste the URL here
 * to turn it on everywhere at once.
 */
export const CALENDLY_HREF = '';

/**
 * Absolute URL of the brand mark used in email headers.
 *
 * Empty until the domain is live and the asset is confirmed reachable, and
 * that is deliberate. Email has no relative base URL, so this must be a fully
 * qualified public URL — and if it 404s, clients with images enabled render a
 * broken-image icon beside the wordmark, which looks worse than no mark at
 * all. An unverifiable asset is gated the same way an unbuilt route is.
 *
 * The header degrades cleanly: the wordmark and role line are live text, so
 * the lockup still reads with no image at all. Set this once markfasel.dev
 * (or .com — see the domain note in the launch checklist) is serving
 * /apple-touch-icon.png, and every transactional email picks it up.
 *
 * Must be a PNG, not the site's SVG: Gmail strips SVG entirely.
 */
export const EMAIL_LOGO_URL = '';

export const UNUSED_ALIASES = [
  'contact@markfasel.dev',
  'speaking@markfasel.dev',
  'partnerships@markfasel.dev',
  'press@markfasel.dev',
] as const;

/* ============================================================================
 * mailto composition
 * ========================================================================== */

interface MailtoOptions {
  to: string;
  subject?: string;
  body?: string;
}

/**
 * Build a correctly-encoded mailto: URI.
 *
 * Two encoding details that are easy to get wrong and produce broken drafts:
 *
 *  1. `URLSearchParams` serializes a space as `+` (form encoding). Mail
 *     clients do not decode `+` in a mailto query — the recipient sees literal
 *     plus signs throughout the subject line. Every `+` is rewritten to `%20`.
 *  2. Newlines must survive as `%0A` so the body template keeps its structure.
 *     `URLSearchParams` already does this correctly; template literals written
 *     by hand usually do not, which is why this helper exists at all.
 *
 * Never pass visitor-supplied input through here. Every caller in this
 * codebase composes from the static templates below — a mailto assembled from
 * untrusted input is a header-injection vector.
 */
export function mailto({ to, subject, body }: MailtoOptions): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);

  const query = params.toString().replace(/\+/g, '%20');
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

/* ============================================================================
 * Templates
 *
 * Each template is a starting point, not a form. A visitor should be able to
 * delete any section and still send something useful — the prompts exist to
 * reduce the blank-page problem, not to extract fields.
 * ========================================================================== */

/** Footer / general "just saying hello". */
export const GENERAL_INQUIRY = {
  address: EMAIL.public,
  href: mailto({
    to: EMAIL.public,
    subject: 'Hello from markfasel.dev',
    body: `Hi Mark,

I'm reaching out because...


Best,
`,
  }),
} as const;

/** Contact page — the secondary path beside the form. */
export const PROJECT_INQUIRY = {
  address: EMAIL.public,
  href: mailto({
    to: EMAIL.public,
    subject: 'Project inquiry from markfasel.dev',
    body: `Hi Mark,

I'm reaching out about a project or opportunity.

A little context:


What I'm looking for help with:


Timeline:


Thanks,
`,
  }),
} as const;

/** Consulting page — used only where the intent is explicitly consulting. */
export const CONSULTING_INQUIRY = {
  address: EMAIL.consulting,
  href: mailto({
    to: EMAIL.consulting,
    subject: 'Consulting inquiry — markfasel.dev',
    body: `Hi Mark,

I'd like to talk about a consulting project.

Company / organization:


What we're working on:


Where we need help:


Desired timeline:


Thanks,
`,
  }),
} as const;

/** Experience page — the recruiter/employment surface. */
export const OPPORTUNITY_INQUIRY = {
  address: EMAIL.opportunities,
  href: mailto({
    to: EMAIL.opportunities,
    subject: 'Opportunity for Mark Fasel',
    body: `Hi Mark,

I'm reaching out about an opportunity.

Company:


Role / opportunity:


A little context:


Thanks,
`,
  }),
} as const;
