import { z } from 'zod';

/**
 * Contact form schema — the single source of truth for the shape, imported by
 * BOTH the client (react-hook-form's zodResolver) and the Server Action.
 *
 * The server re-validates rather than trusting the client: the action is a
 * public endpoint and client-side validation is a UX affordance, not a
 * security boundary.
 */

/* ============================================================================
 * Qualification fields
 *
 * Project type, budget, and timeline are required. Requiring them is what
 * turns the form from a message box into a qualification step: a submission
 * that names a budget band and a timeline can be triaged before it is read.
 *
 * ## Why each list ends with an uncertainty option
 *
 * Requiring a field that a visitor genuinely cannot answer does not produce
 * information — it produces a guess, and a fabricated budget is worse than no
 * budget because it will be acted on. Every list therefore carries an honest
 * "I don't know yet" that is a real answer rather than an escape hatch:
 * "Not sure / Need guidance" on a budget is itself a useful signal about where
 * the conversation should start.
 *
 * The list order is deliberate: the uncertainty option sits LAST, after the
 * concrete choices, so a visitor who does know reads their own answer first
 * and is not offered a shortcut past the question.
 * ========================================================================== */

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
  "Not sure yet / Let's figure it out",
] as const;

export const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000–$15,000',
  '$15,000–$30,000',
  '$30,000+',
  'Advisory conversation',
  'Not sure / Need guidance',
] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within 1–3 months',
  'Within 3–6 months',
  'Later this year',
  'Not sure yet',
] as const;

/**
 * Required <select>: the placeholder submits '' and must not validate.
 *
 * The input and output types differ on purpose, and both halves matter:
 *
 *   input   '' | T[number]   the form defaults these to '' (the placeholder),
 *                            so the type it holds before validation must
 *                            admit it.
 *   output  T[number]        after a successful parse '' is impossible, which
 *                            is what lets the email templates treat these
 *                            three fields as guaranteed rather than optional.
 *
 * A bare `z.enum` would reject '' too, but it reports Zod's own "invalid
 * option" text, which reads as a system error rather than an instruction. The
 * union names the untouched case explicitly so the visitor gets a sentence
 * telling them what to do. The narrowing cast in the transform is safe by
 * construction — `refine` has already excluded the only other member.
 *
 * This is also why the form carries `noValidate` and does not lean on the HTML
 * `required` attribute: the browser's bubble is unstyled, inconsistently
 * announced, and absent entirely for anything that reaches the Server Action
 * by another route. The schema is the boundary, and it runs on both sides.
 */
const requiredEnum = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z
    .union([z.enum(values), z.literal('')])
    .refine((value) => value !== '', { message })
    .transform((value) => value as T[number]);

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

  // Company and role stay optional. An independent founder and a VP at a
  // 5,000-person company are both welcome here, and only one of them has an
  // answer for "Role" that means anything.
  company: optionalText(160),
  role: optionalText(160),

  projectType: requiredEnum(PROJECT_TYPES, 'Choose the closest project type.'),
  budget: requiredEnum(BUDGET_RANGES, 'Choose a budget range.'),
  timeline: requiredEnum(TIMELINES, 'Choose a timeline.'),

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
