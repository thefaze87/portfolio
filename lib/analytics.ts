/**
 * Analytics configuration and the event registry.
 *
 * ## Why this file has no client imports
 *
 * `@next/third-parties/google` is marked `'use client'`. Importing it here
 * would make this module unusable from a Server Component — including the root
 * layout, which is the one place that needs the measurement ID. So the split
 * mirrors lib/email.ts ↔ lib/email.server.ts:
 *
 *   lib/analytics.ts         config + event names. Safe on both sides.
 *   lib/analytics.client.ts  'use client'. The send function.
 *
 * Import the sender from a Client Component; import this from anywhere.
 *
 * ## The ID is public, and that is fine
 *
 * A GA4 measurement ID is not a secret — it ships in the page source of every
 * site that uses it, which is why it is `NEXT_PUBLIC_`. It is still an
 * environment variable rather than a constant so the same build can point at a
 * different property, and so a fork or a preview deploy does not silently
 * write into production's data.
 */

/**
 * GA4 measurement ID, e.g. `G-XXXXXXXXXX`.
 *
 * `NEXT_PUBLIC_` values are inlined at build time, so this is a literal in the
 * client bundle rather than a runtime lookup — changing it requires a rebuild,
 * not just a restart.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/**
 * Presence of the ID is the only switch.
 *
 * Deliberately not gated on `NODE_ENV === 'production'`: that makes analytics
 * impossible to verify locally, and verification is the whole reason a bug in
 * this layer stays hidden for months. Leave the variable unset in `.env.local`
 * for normal development; set it temporarily and use GA4's DebugView when you
 * need to confirm an event actually arrives.
 *
 * The practical consequence: no ID, no script, no cookies, no network requests
 * — the analytics layer is completely absent rather than loaded-and-idle.
 */
export const isAnalyticsEnabled = GA_MEASUREMENT_ID.length > 0;

/* ============================================================================
 * Event registry
 *
 * One name per meaningful action. Adding an event is a single line here plus a
 * single `trackEvent` call at the site of the interaction.
 *
 * ## Naming
 *
 * snake_case, `object_action`, matching GA4's own convention for custom
 * events. GA4 reserves a set of names (`page_view`, `session_start`,
 * `first_visit`, `click`, `scroll`, …) — never reuse one, or the custom event
 * collides with the automatic one and both become unreadable.
 *
 * ## page_view is absent on purpose
 *
 * It is not sent from application code at all. See lib/analytics.client.ts.
 * ========================================================================== */

export const ANALYTICS_EVENTS = {
  /** Résumé PDF downloaded. `location` distinguishes the surfaces. */
  RESUME_DOWNLOAD: 'resume_download',
  /** Contact form submitted. Fires on outcome, not on click. */
  CONTACT_SUBMIT: 'contact_submit',
  /** A product detail page was opened. */
  PRODUCT_VIEW: 'product_view',
  /** A project case study was opened. */
  PROJECT_VIEW: 'project_view',
  /** A consulting call-to-action was followed. */
  CONSULTING_CTA: 'consulting_cta',
  /** An outbound click to a platform profile or the newsletter. */
  OUTBOUND_CLICK: 'outbound_click',
  /** A `mailto:` link was followed. */
  EMAIL_CLICK: 'email_click',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Event parameters.
 *
 * GA4 accepts scalars only — an object or array is dropped silently, which is
 * the single most common reason a custom dimension turns up empty. The type
 * makes that constraint visible at the call site rather than in a report weeks
 * later.
 *
 * Keep keys under 40 characters and values under 100; GA4 truncates beyond
 * that without warning.
 */
export type AnalyticsEventParams = Record<string, string | number | boolean>;

/**
 * Where an event happened, when the same action exists on several surfaces.
 *
 * A closed set rather than free text: "experience_page" and "experience-page"
 * become two rows in a GA4 report and neither is right.
 */
export const ANALYTICS_LOCATIONS = {
  EXPERIENCE_CLOSING: 'experience_closing',
  ABOUT: 'about',
  CONTACT: 'contact',
  FOOTER: 'footer',
  HEADER: 'header',
  HOME: 'home',
  WRITING: 'writing',
} as const;

export type AnalyticsLocation = (typeof ANALYTICS_LOCATIONS)[keyof typeof ANALYTICS_LOCATIONS];
