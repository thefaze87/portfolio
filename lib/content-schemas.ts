import { z } from 'zod';

/**
 * Frontmatter contracts for the MDX content collections.
 *
 * These are parsed at build time, not runtime. A malformed or incomplete
 * frontmatter block fails `pnpm build` rather than rendering a broken page —
 * which is the whole point of validating content you author by hand. The
 * previous JSON content was read through unchecked `as` casts, and a typo
 * there became a runtime crash instead of a build error.
 */

/** The four editorial pillars. Every essay belongs to exactly one, which is
 *  what makes topic-cluster SEO and the /writing filter possible. */
export const PILLARS = ['architecture', 'ai', 'leadership', 'systems-thinking'] as const;
export type Pillar = (typeof PILLARS)[number];

export const PILLAR_LABELS: Record<Pillar, string> = {
  architecture: 'Architecture',
  ai: 'AI',
  leadership: 'Leadership',
  'systems-thinking': 'Systems Thinking',
};

/** Shared across both collections. */
const baseFrontmatter = {
  title: z.string().min(1),
  /** Plain-language summary. Also the meta description and the card excerpt,
   *  so it has to stand alone — capped to stay inside search snippet limits. */
  excerpt: z.string().min(1).max(240),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .optional(),
  /** Draft entries are excluded from listings, sitemaps, and feeds. They are
   *  still reachable by direct URL in dev so you can preview them. */
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
};

export const essayFrontmatterSchema = z.object({
  ...baseFrontmatter,
  pillar: z.enum(PILLARS),
  /**
   * Absolute URL of the Substack post, when this essay is also published there.
   *
   * Substack is the publishing platform and the newsletter; the site is the
   * archive and discovery layer. Setting this does two things: it emits
   * `rel="canonical"` pointing at Substack so the duplicate bodies can never
   * compete with each other in search, and it surfaces a "Read on Substack"
   * link on the essay.
   *
   * Leave it unset for essays that only exist here — an unset value keeps the
   * canonical on this site, which is correct for original content and is why
   * this is opt-in rather than derived.
   */
  canonicalUrl: z.string().url().optional(),
});

export const projectFrontmatterSchema = z.object({
  ...baseFrontmatter,
  /** The organization. Use a descriptive stand-in ("a national retail
   *  platform") when the engagement is under NDA — vague plus real numbers
   *  beats a named logo plus vague claims. */
  client: z.string().min(1),
  role: z.string().min(1),
  /** Display string, e.g. "2025" or "2020–2024". Not parsed. */
  period: z.string().min(1),
  /** Stack chips shown on the card and in the article header. */
  stack: z.array(z.string()).default([]),
  /** Short outcome lines for the index card. Keep them concrete. */
  outcomes: z.array(z.string()).default([]),
});

export type EssayFrontmatter = z.infer<typeof essayFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

/** What the loaders return: validated frontmatter plus derived fields. */
export interface ContentEntry<TFrontmatter> {
  slug: string;
  frontmatter: TFrontmatter;
  /** Raw MDX body, frontmatter stripped. Compiled by the page. */
  body: string;
  readingMinutes: number;
}

export type Essay = ContentEntry<EssayFrontmatter>;
export type Project = ContentEntry<ProjectFrontmatter>;

/* ============================================================================
 * Credentials — education and certifications
 *
 * Sourced from the published résumé. Kept as data rather than JSX because two
 * consumers need it and they must never disagree: the Experience page renders
 * it, and lib/schema.ts turns it into `alumniOf` / `hasCredential` on the
 * Person entity. A fact stated twice in two files is a fact that eventually
 * contradicts itself.
 * ========================================================================== */

const educationSchema = z.object({
  /** The award itself, e.g. "Master of Science". */
  credential: z.string().min(1),
  /** Field of study, e.g. "Internet Marketing". */
  field: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().optional(),
});

const certificationSchema = z.object({
  /** Certification name without the issuer — the issuer is its own field so
   *  the pair can render as "Microsoft · Azure Fundamentals" or feed
   *  `recognizedBy` in JSON-LD without string surgery. */
  name: z.string().min(1),
  issuer: z.string().min(1),
  /** Public page describing the credential, when one exists. Omitted rather
   *  than guessed — a dead link is worse than no link. */
  url: z.string().url().optional(),
});

export const credentialsSchema = z.object({
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
});

export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;

/* ============================================================================
 * Projects index
 *
 * The /projects listing is authored as JSON rather than derived from the MDX
 * collection, because not every project has (or should have) a full case
 * study. Opsly is mid-architecture; TrustLaunch is still being defined;
 * LIFE SURGE work is partly confidential. Each still deserves an honest card.
 *
 * `caseStudy` links a card to an MDX file in content/projects/ when one
 * exists. Absent, the card renders without a CTA rather than linking nowhere —
 * the same discipline as published-route gating in lib/nav.ts.
 * ========================================================================== */

const projectCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The one-line frame: what kind of thing this is. */
  positioning: z.string().min(1),
  /** Honest state. "In development" is a feature, not an apology. */
  status: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  /** Slug of an MDX case study in content/projects/. Validated at load time
   *  against the actual collection so a card can never link to a missing page. */
  caseStudy: z.string().optional(),
  cta: z.string().nullable().optional(),
  /** Splits a roadmap-stage project into what is real vs. planned, so nothing
   *  reads as a claim that unbuilt features exist. */
  buildState: z
    .object({
      built: z.array(z.string()).default([]),
      inDevelopment: z.array(z.string()).default([]),
      roadmap: z.array(z.string()).default([]),
    })
    .optional(),
  /** Flags a card that is deliberately thin pending more information. */
  needsDetail: z.boolean().optional(),
  /** Marks work where detail is withheld for client confidentiality. */
  confidential: z.boolean().optional(),
});

/* ============================================================================
 * Products
 *
 * Products are ventures Mark owns; Projects are work he was hired to do.
 * That ownership line is the whole reason these are separate collections —
 * a product has a lifecycle (status, roadmap, changelog), a project has an
 * engagement (client, role, period). Forcing both through one schema means
 * every field is optional and nothing is enforced.
 *
 * ## Why structured data lives in JSON, not frontmatter
 *
 * `splitFrontmatter` in lib/mdx.ts deliberately parses only flat scalars,
 * string arrays, and booleans — and Prettier reformats .mdx files, so making
 * that parser handle nested objects would be a standing liability. Links,
 * roadmap entries, and timeline events are objects, so they live in
 * content/products/index.json where JSON handles them natively and Zod
 * validates them.
 *
 * The split is therefore: index.json owns structured product data; the MDX
 * body owns narrative (problem, solution, vision, architecture, lessons).
 * The detail page joins them on slug.
 * ========================================================================== */

/**
 * Lifecycle status. A closed set so the badge can be styled consistently and
 * so "In development" can never drift into "in-dev" / "WIP" / "Building".
 * Only `Launching` carries the accent — it is the one state that is news.
 *
 * ## Array order is display order
 *
 * /products derives STATUS_ORDER from this array, so the position of a status
 * here decides where its products sort on the index. Adding a status to the
 * end would silently sort it last; place it where it belongs in the ramp.
 *
 * ## Why `Coming Soon` sits second
 *
 * It is the odd one out: the other three describe how much is *built*, while
 * this one describes whether the product has been *announced*. A product that
 * is deep in design but not yet named is less built than one In development,
 * and more imminent as news.
 *
 * It ranks by imminence rather than by build depth, because that is what the
 * label tells a reader — "Coming Soon" beneath three In-development products
 * would read as a contradiction. The overclaim this risks is handled where it
 * belongs: the product's own `buildState` says exactly what exists, and its
 * page says it is in design and validation. The chip promises an announcement,
 * not a shipped feature.
 */
export const PRODUCT_STATUSES = ['Launching', 'Coming Soon', 'In development', 'Planned'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/** MDX frontmatter for a product. Deliberately minimal — everything
 *  structured is in the registry; this is just enough to render an article. */
export const productFrontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1).max(240),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type ProductFrontmatter = z.infer<typeof productFrontmatterSchema>;
export type ProductArticle = ContentEntry<ProductFrontmatter>;

const productLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const timelineEventSchema = z.object({
  /** Free-form so "Q2 2026" and "March 2026" are both valid. Not parsed. */
  date: z.string().min(1),
  event: z.string().min(1),
});

export const productSchema = z.object({
  /** URL slug and registry key. Matches the MDX filename when one exists. */
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(PRODUCT_STATUSES),
  /** One or two sentences for the index card. */
  summary: z.string().min(1),
  stack: z.array(z.string()).default([]),
  /** Headline capabilities for the card. Keep to five or fewer. */
  highlights: z.array(z.string()).default([]),
  /** Who it serves. Rendered on the detail page when present. */
  markets: z.array(z.string()).default([]),
  /** Honest build split. Required for anything not yet Launching. */
  buildState: z
    .object({
      built: z.array(z.string()).default([]),
      inDevelopment: z.array(z.string()).default([]),
      roadmap: z.array(z.string()).default([]),
    })
    .optional(),
  timeline: z.array(timelineEventSchema).default([]),
  /** External links. Empty renders the placeholder rather than a dead row. */
  links: z.array(productLinkSchema).default([]),
  /** True once an MDX body exists at content/products/<id>.mdx. Cross-checked
   *  at load time so a card can never link to a page that isn't there. */
  hasDetail: z.boolean().default(false),
});

export const productsIndexSchema = z.object({
  products: z.array(productSchema),
});

export type Product = z.infer<typeof productSchema>;
export type ProductsIndex = z.infer<typeof productsIndexSchema>;

export const projectsIndexSchema = z.object({
  featured: z.array(projectCardSchema),
  selected: z.array(projectCardSchema),
  labs: z.array(projectCardSchema),
});

export type ProjectCard = z.infer<typeof projectCardSchema>;
export type ProjectsIndex = z.infer<typeof projectsIndexSchema>;
