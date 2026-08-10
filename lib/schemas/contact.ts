import { z } from 'zod';

/**
 * Contact form schema — the single source of truth for the shape, imported by
 * BOTH the client (react-hook-form's zodResolver) and the Server Action.
 *
 * The server re-validates rather than trusting the client: the action is a
 * public endpoint and client-side validation is a UX affordance, not a
 * security boundary.
 */

export const PROJECT_TYPES = [
  'Architecture advisory',
  'AI strategy',
  'AI automation',
  'Custom software',
  'Integrations',
  'Frontend modernization',
  'Product strategy',
  'Technical leadership',
  'Speaking or collaboration',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Exploring / not defined',
  'Under $5,000',
  '$5,000–$15,000',
  '$15,000–$30,000',
  '$30,000+',
  'Advisory conversation',
] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within 1–3 months',
  'Within 3–6 months',
  'Later this year',
  'Not sure yet',
] as const;

/** Optional <select> fields submit '' when untouched; treat that as absent. */
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? undefined : v));

/** Optional free-text: trim, drop empties, and cap to keep payloads sane. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v === '' ? undefined : v));

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(120, 'Keep this under 120 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .max(200, 'Keep this under 200 characters.')
    .pipe(z.email('Enter a valid email address.')),
  message: z
    .string()
    .trim()
    .min(10, 'Tell me a little more — at least 10 characters.')
    .max(5000, 'Keep this under 5,000 characters.'),

  company: optionalText(160),
  role: optionalText(160),
  projectType: optionalEnum(PROJECT_TYPES),
  budget: optionalEnum(BUDGET_RANGES),
  timeline: optionalEnum(TIMELINES),

  /**
   * Honeypot. Real users never see or focus this; any value means a bot.
   *
   * Deliberately permissive at the schema level. Rejecting a filled honeypot
   * here would (a) make the client resolver block submission outright and
   * (b) return a field error naming the trap — telling the bot exactly what
   * caught it. Instead the value passes validation and the Server Action
   * inspects it, discarding the submission while reporting success.
   */
  website: z.string().optional(),
});

/** Input type — what the form holds before Zod transforms run. */
export type ContactFormValues = z.input<typeof contactSchema>;
/** Output type — what the action receives after parsing. */
export type ContactSubmission = z.output<typeof contactSchema>;

/** Discriminated result returned by the Server Action to the form. */
export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactFormValues, string>> };
