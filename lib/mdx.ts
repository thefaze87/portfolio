import fs from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import {
  projectFrontmatterSchema,
  essayFrontmatterSchema,
  productFrontmatterSchema,
  productsIndexSchema,
  projectsIndexSchema,
  credentialsSchema,
  type Project,
  type ContentEntry,
  type Credentials,
  type Essay,
  type Pillar,
  type Product,
  type ProductArticle,
  type ProjectsIndex,
} from '@/lib/content-schemas';
import projectsIndexData from '@/content/projects/index.json';
import productsIndexData from '@/content/products/index.json';
import credentialsData from '@/content/experience/credentials.json';

/**
 * File-based content loaders.
 *
 * MDX files live in content/essays, content/projects, and content/products. Everything here
 * runs at build time in a Server Component context — `fs` never reaches the
 * client bundle.
 *
 * Why hand-rolled rather than a content library: the collection is two
 * directories of flat files with no nesting, no i18n, and no incremental
 * rebuild requirement. A loader is ~100 lines; a content framework is a
 * dependency, a config file, and a generated types step. When the collection
 * outgrows this, the swap is contained to this file.
 */

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const ESSAYS_DIR = path.join(CONTENT_ROOT, 'essays');
const PROJECTS_DIR = path.join(CONTENT_ROOT, 'projects');
const PRODUCTS_DIR = path.join(CONTENT_ROOT, 'products');

/** Drafts render by direct URL in dev, but never appear in listings, the
 *  sitemap, or feeds — in production they are excluded entirely. */
const INCLUDE_DRAFTS = process.env.NODE_ENV === 'development';

const WORDS_PER_MINUTE = 220;

/**
 * Split YAML frontmatter from the MDX body.
 *
 * Deliberately minimal rather than pulling in a YAML dependency: the
 * frontmatter here is flat `key: value` pairs, arrays, and booleans. Anything
 * more exotic should be a component prop, not frontmatter.
 *
 * IMPORTANT — this parser is not the only tool that touches these files.
 * `pnpm format` runs Prettier over .mdx, and Prettier treats frontmatter as
 * real YAML: it reflows a long inline array onto multiple lines, and pushes
 * the opening bracket onto the line after its key. Both are valid YAML and
 * both broke an earlier, stricter version of this function. The normalization
 * step below folds those two shapes back to one line before parsing.
 *
 * If frontmatter grows past this (nested maps, block scalars, anchors), stop
 * extending this and adopt a real YAML parser — the Zod schemas will surface
 * the breakage as a build failure rather than a broken page, which is how the
 * Prettier reflow was caught.
 */
function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const [, rawBlock = '', body = ''] = match;
  const data: Record<string, unknown> = {};

  const block = rawBlock
    // Collapse a multi-line [ … ] array onto a single line.
    .replace(/\[[^\]]*\]/g, (arr) => arr.replace(/\s*\r?\n\s*/g, ' '))
    // Pull an array that Prettier moved onto its own line back up to its key.
    .replace(/:\s*\r?\n\s*(\[)/g, ': $1');

  for (const line of block.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep === -1) continue;

    const key = line.slice(0, sep).trim();
    const rawValue = line.slice(sep + 1).trim();
    if (!key) continue;

    if (rawValue === 'true' || rawValue === 'false') {
      data[key] = rawValue === 'true';
    } else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      const inner = rawValue.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''))
            // Prettier emits a trailing comma in reflowed arrays, which would
            // otherwise produce a phantom empty entry.
            .filter(Boolean)
        : [];
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }

  return { data, body };
}

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Read + validate one collection. Throws with the offending filename so a
 *  build failure points at the file rather than at a Zod stack trace. */
function loadCollection<TSchema extends z.ZodType>(
  dir: string,
  schema: TSchema,
): ContentEntry<z.infer<TSchema>>[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, body } = splitFrontmatter(raw);

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
          .join('; ');
        throw new Error(
          `Invalid frontmatter in ${path.relative(process.cwd(), path.join(dir, file))} — ${issues}`,
        );
      }

      return {
        slug,
        frontmatter: parsed.data as z.infer<TSchema>,
        body,
        readingMinutes: readingMinutes(body),
      };
    });

  // Newest first. Drafts filtered unless we're in dev.
  return entries
    .filter((entry) => INCLUDE_DRAFTS || !(entry.frontmatter as { draft: boolean }).draft)
    .sort((a, b) =>
      (b.frontmatter as { publishedAt: string }).publishedAt.localeCompare(
        (a.frontmatter as { publishedAt: string }).publishedAt,
      ),
    );
}

/* ============================================================================
 * Essays
 * ========================================================================== */

export function getAllEssays(): Essay[] {
  return loadCollection(ESSAYS_DIR, essayFrontmatterSchema);
}

export function getEssayBySlug(slug: string): Essay | undefined {
  return getAllEssays().find((essay) => essay.slug === slug);
}

export function getEssaysByPillar(pillar: Pillar): Essay[] {
  return getAllEssays().filter((essay) => essay.frontmatter.pillar === pillar);
}

/* ============================================================================
 * Projects (case studies)
 * ========================================================================== */

export function getAllProjects(): Project[] {
  return loadCollection(PROJECTS_DIR, projectFrontmatterSchema);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((study) => study.slug === slug);
}

/* ============================================================================
 * Products
 *
 * Ventures Mark owns, as opposed to work he was hired for. Structured data
 * lives in the registry (index.json); narrative lives in the MDX body. See
 * lib/content-schemas.ts for why that split exists.
 * ========================================================================== */

export function getAllProductArticles(): ProductArticle[] {
  return loadCollection(PRODUCTS_DIR, productFrontmatterSchema);
}

export function getProductArticleBySlug(slug: string): ProductArticle | undefined {
  return getAllProductArticles().find((entry) => entry.slug === slug);
}

/**
 * Load and validate the product registry.
 *
 * `hasDetail` is derived here rather than trusted from the JSON: it is set
 * from whether an MDX body actually exists and is published. That makes the
 * "listed but no page yet" state — PlainText, Shepherd — impossible to get
 * wrong, and means marking a product's article `draft: true` silently removes
 * its link instead of failing the build.
 */
export function getProducts(): Product[] {
  const parsed = productsIndexSchema.safeParse(productsIndexData);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid content/products/index.json — ${issues}`);
  }

  const published = new Set(getAllProductArticles().map((a) => a.slug));
  return parsed.data.products.map((product) => ({
    ...product,
    hasDetail: published.has(product.id),
  }));
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id);
}

/* ============================================================================
 * Credentials
 * ========================================================================== */

/**
 * Load and validate education + certifications.
 *
 * Validated for the same reason the other registries are: this data is read by
 * both the Experience page and the Person JSON-LD, so a typo would ship a
 * malformed credential into the knowledge graph rather than fail a build.
 */
export function getCredentials(): Credentials {
  const parsed = credentialsSchema.safeParse(credentialsData);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid content/experience/credentials.json — ${issues}`);
  }
  return parsed.data;
}

/* ============================================================================
 * Projects index
 * ========================================================================== */

/**
 * Load and validate the projects index.
 *
 * Beyond Zod validation, this cross-checks every `caseStudy` slug against the
 * MDX collection that actually exists. A card pointing at a missing case study
 * fails the build rather than shipping a link to a 404 — the content-layer
 * equivalent of the published-route gating in lib/nav.ts.
 */
export function getProjectsIndex(): ProjectsIndex {
  const parsed = projectsIndexSchema.safeParse(projectsIndexData);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid content/projects/index.json — ${issues}`);
  }

  const slugs = new Set(getAllProjects().map((p) => p.slug));
  const missing = [...parsed.data.featured, ...parsed.data.selected, ...parsed.data.labs]
    .filter((card) => card.caseStudy && !slugs.has(card.caseStudy))
    .map((card) => `${card.id} → ${card.caseStudy}`);

  if (missing.length > 0) {
    throw new Error(
      `content/projects/index.json references case studies that do not exist: ${missing.join(', ')}`,
    );
  }

  return parsed.data;
}

/**
 * Display helper — "7 March 2026" reads as editorial; ISO reads as a log.
 *
 * Accepts a bare date ("2026-03-07") or a full ISO timestamp
 * ("2026-03-07T11:50:43.000Z"). The timestamp form arrives from the Substack
 * feed, where pubDate carries a time; without the slice, `Number("07T11:...")`
 * is NaN and the raw ISO string leaks onto the page.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
