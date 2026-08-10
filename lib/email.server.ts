/**
 * The real mailbox. Server-only by construction.
 *
 * `me@markfasel.dev` is where everything ultimately lands, and it is the one
 * address that must never be rendered publicly — a scraped private inbox
 * cannot be un-scraped, and the public aliases in lib/email.ts exist precisely
 * so it never has to appear.
 *
 * ## Why this is a separate file
 *
 * Anything exported from lib/email.ts can be imported by a Client Component
 * and shipped to the browser. Isolating the private address here means
 * exposing it requires an explicit, reviewable import of a file named
 * `.server.ts` — not an invisible property access on a shared object.
 *
 * Today the only importer is the contact Server Action (`'use server'`).
 *
 * **Hardening available:** add the `server-only` package and import it at the
 * top of this file. That converts the convention into a build-time error if a
 * client module ever pulls this in. It is one dependency and the canonical
 * Next.js mechanism; it is not installed here only because adding it was not
 * yet approved. Until then the guarantee is verified by scanning the built
 * client bundles for this address — see the launch checklist.
 *
 * Not an environment variable: it is not a secret, and an env var here would
 * add a deployment step that can be missed silently — producing a contact form
 * that appears to work and delivers nowhere.
 */
export const INBOX = 'me@markfasel.dev';

/**
 * The From identity for application-generated mail.
 *
 * Must be on a Resend-verified domain or delivery lands in spam. Operational
 * mail is sent from `notifications@` rather than a human address so that a
 * reply to an automated notification never lands somewhere unmonitored, and so
 * inbox rules can separate machine mail from human mail.
 */
export const NOTIFICATION_FROM = 'Mark Fasel Website <notifications@markfasel.dev>';

/**
 * The From identity for the visitor acknowledgement.
 *
 * Human-facing, so it comes from the public address a visitor would recognize
 * — and its Reply-To is the real inbox, so a reply reaches Mark directly.
 */
export const ACKNOWLEDGEMENT_FROM = 'Mark Fasel <hello@markfasel.dev>';
