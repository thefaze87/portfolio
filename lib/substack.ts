import { z } from 'zod';
import { NEWSLETTER } from '@/lib/nav';

/**
 * Substack feed adapter.
 *
 * Substack is the publishing platform; this site is the discovery and archive
 * surface. This module is the only place that knows what RSS looks like —
 * pages consume `SubstackPost`, never raw XML.
 *
 * ## Why a hand-rolled parser rather than an XML dependency
 *
 * The same reasoning as lib/mdx.ts: one machine-generated feed, a fixed set of
 * six fields, no namespaces beyond `dc:` and `content:`. A parser is ~80 lines;
 * an XML library is a dependency, a bundle cost, and a supply-chain surface for
 * a single fetch. Every extracted value is validated by Zod before it escapes
 * this file, so a shape change surfaces as dropped posts and a server log
 * rather than as a broken page.
 *
 * If Substack ever emits nested item structures or additional namespaces,
 * stop extending the regexes and adopt a real parser.
 *
 * ## Failure is not exceptional
 *
 * Substack is a third party this site does not control. Every failure mode —
 * network error, timeout, HTTP error, malformed XML, empty feed — resolves to
 * an empty array, never a throw. /writing renders its shell and a restrained
 * fallback. A newsletter being briefly unreachable must never take down a page
 * that also carries the site's own essays.
 */

export const SUBSTACK_URL = NEWSLETTER.href.replace(/\/+$/, '');
export const SUBSTACK_FEED_URL = `${SUBSTACK_URL}/feed`;

/** Cache for an hour. A newsletter publishes a few times a month; polling more
 *  often spends build/ISR budget to discover nothing. */
const REVALIDATE_SECONDS = 3600;

/** Bound the request so a hanging third party cannot stall a page render or a
 *  production build. */
const FETCH_TIMEOUT_MS = 8000;

/**
 * Minimum plaintext length for a post to be considered real.
 *
 * Substack seeds every new publication with a stub post titled "Coming soon"
 * whose entire body is "This is <Publication>. Subscribe now" — 47 characters.
 * The shortest genuine post in this feed is ~2,300. Filtering on body length
 * rather than on the title avoids suppressing a real post that happens to be
 * called "Coming soon", and needs no maintenance when the stub is deleted.
 */
const MIN_BODY_CHARS = 200;

/** Roughly one short paragraph. Long enough to convey the argument, short
 *  enough that the reader still has a reason to click through. */
const EXCERPT_TARGET_CHARS = 240;

/**
 * A normalized post. Every field is present in the feed — nothing here is
 * inferred, defaulted from elsewhere, or generated.
 *
 *   title       <title>            (CDATA)
 *   url         <link>
 *   guid        <guid>             stable key; isPermaLink="false"
 *   publishedAt <pubDate>          RFC-822, normalized to ISO-8601
 *   excerpt     <content:encoded>  first meaningful prose, HTML stripped
 *   author      <dc:creator>       (CDATA)
 */
export interface SubstackPost {
  title: string;
  url: string;
  guid: string;
  /** ISO-8601. Safe for <time dateTime>. */
  publishedAt: string;
  excerpt: string;
  author: string;
}

const substackPostSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  guid: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T/),
  excerpt: z.string(),
  author: z.string(),
});

/* ============================================================================
 * XML / HTML text handling
 * ========================================================================== */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
};

/**
 * Decode HTML entities.
 *
 * Runs twice by design. Substack wraps `<description>` in CDATA *and* HTML-
 * encodes its contents, so `don't` arrives as `don&#8217;t` inside the CDATA
 * block — one pass leaves a visible `&#8217;` on the page. Decoding is
 * idempotent for already-decoded text, so the second pass is safe.
 */
function decodeEntities(input: string): string {
  const once = (s: string) =>
    s
      .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
        String.fromCodePoint(Number.parseInt(hex, 16)),
      )
      .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
      .replace(
        /&([a-z]+);/gi,
        (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match,
      );

  return once(once(input));
}

/** Read one child element, CDATA-aware. Scoped to a single <item> block by the
 *  caller — `<title>` and `<link>` also appear on `<channel>`. */
function readTag(itemXml: string, tag: string): string {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i');
  const raw = pattern.exec(itemXml)?.[1];
  if (raw === undefined) return '';

  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(raw);
  return decodeEntities((cdata?.[1] ?? raw).trim());
}

/**
 * Reduce a post body to one short paragraph of its own prose.
 *
 * Substack bodies open with an empty `<p></p>` and a `captioned-image-
 * container` figure, and close with subscribe/share buttons. None of that is
 * the article, so image and widget containers are removed wholesale before any
 * text is read — stripping tags first would leave button labels and image
 * captions stranded in the prose.
 */
function extractExcerpt(encodedHtml: string): string {
  const withoutWidgets = encodedHtml
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<div class="captioned-image-container"[\s\S]*?<\/div>/gi, ' ')
    .replace(/<div class="subscription-widget[\s\S]*?<\/div>/gi, ' ')
    .replace(/<div[^>]*class="[^"]*pencraft[^"]*"[\s\S]*?<\/div>/gi, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ');

  const paragraphs = [...withoutWidgets.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) =>
      decodeEntities((match[1] ?? '').replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim(),
    )
    // Drop empties, stray captions, and Substack's call-to-action labels —
    // these are furniture, not the author's argument.
    .filter((text) => text.length >= 15)
    .filter((text) => !/^(subscribe|share|leave a comment|thanks for reading)\b/i.test(text));

  if (paragraphs.length === 0) return '';

  let excerpt = '';
  for (const paragraph of paragraphs) {
    if (!excerpt) {
      excerpt = paragraph;
    } else {
      // Substack renders the post's subtitle as the first body paragraph, and
      // subtitles carry no terminal punctuation — joining on a bare space
      // produces "They Fail Because of Intent Most code reviews...". An em
      // dash marks the paragraph break without inventing a sentence, which
      // fabricating a full stop would.
      const needsBreak = !/[.!?…"”')]$/.test(excerpt);
      excerpt += needsBreak ? ` — ${paragraph}` : ` ${paragraph}`;
    }
    if (excerpt.length >= EXCERPT_TARGET_CHARS) break;
  }

  return truncateAtBoundary(excerpt, EXCERPT_TARGET_CHARS);
}

/**
 * Trim to length without severing a word.
 *
 * Prefers the last sentence end inside the budget so the excerpt reads as a
 * finished thought; falls back to the last word boundary with an ellipsis when
 * the first sentence is longer than the budget.
 */
function truncateAtBoundary(text: string, max: number): string {
  if (text.length <= max) return text;

  const window = text.slice(0, max);
  const lastSentence = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('? '),
    window.lastIndexOf('! '),
  );

  // Only honour a sentence break past the halfway mark; an early one would
  // throw away most of the budget and read as a truncated fragment. The quote
  // check catches a full stop *inside* a quotation — cutting at one strands an
  // opening curly quote with no partner ('…taught like a toolkit: "Here's
  // merge.'), which reads as a rendering bug rather than an excerpt.
  if (lastSentence > max * 0.5) {
    const candidate = window.slice(0, lastSentence + 1);
    if (countOf(candidate, '“') === countOf(candidate, '”')) return candidate;
  }

  const lastSpace = window.lastIndexOf(' ');
  const trimmed = window.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[,;:—–-]+$/, '');
  // Re-check after the word-boundary cut for the same reason.
  const balanced =
    countOf(trimmed, '“') === countOf(trimmed, '”')
      ? trimmed
      : trimmed.slice(0, trimmed.lastIndexOf('“')).replace(/[\s,;:—–-]+$/, '');

  return `${balanced}…`;
}

function countOf(text: string, char: string): number {
  let n = 0;
  for (const c of text) if (c === char) n += 1;
  return n;
}

/** RFC-822 (`Tue, 24 Feb 2026 23:35:40 GMT`) → ISO-8601. Empty when unparseable
 *  so Zod rejects the post rather than rendering an "Invalid Date". */
function toIsoDate(rfc822: string): string {
  const parsed = new Date(rfc822);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

/* ============================================================================
 * Public API
 * ========================================================================== */

/** Parse a feed document into validated posts. Exported for the feed-shape
 *  check in scripts/, and so parsing is testable without a network call. */
export function parseSubstackFeed(xml: string): SubstackPost[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1] ?? '');

  return items.flatMap((item) => {
    const body = readTag(item, 'content:encoded');
    const plainLength = decodeEntities(body.replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim().length;

    // Substack's seeded stub — see MIN_BODY_CHARS.
    if (plainLength < MIN_BODY_CHARS) return [];

    const candidate = {
      title: readTag(item, 'title'),
      url: readTag(item, 'link'),
      guid: readTag(item, 'guid'),
      publishedAt: toIsoDate(readTag(item, 'pubDate')),
      excerpt: extractExcerpt(body),
      author: readTag(item, 'dc:creator'),
    };

    const parsed = substackPostSchema.safeParse(candidate);
    if (!parsed.success) {
      console.error(
        `[substack] Skipping malformed item ${candidate.url || '(no link)'} — ` +
          parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      );
      return [];
    }

    return [parsed.data];
  });
}

/**
 * Fetch the publication's recent posts, newest first.
 *
 * Server-only: called from a Server Component, cached by Next's data cache for
 * REVALIDATE_SECONDS. Returns `[]` on any failure — callers render a fallback,
 * they never handle an error.
 */
export async function getSubstackPosts(limit = 3): Promise<SubstackPost[]> {
  try {
    const response = await fetch(SUBSTACK_FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { accept: 'application/rss+xml, application/xml, text/xml' },
    });

    if (!response.ok) {
      console.error(`[substack] Feed responded ${response.status} ${response.statusText}`);
      return [];
    }

    const posts = parseSubstackFeed(await response.text());
    if (posts.length === 0) console.error('[substack] Feed parsed but yielded no usable posts');

    return posts
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, Math.max(0, limit));
  } catch (cause) {
    // Network failure, DNS, timeout. Logged for the server, invisible to the
    // visitor — the page renders its fallback.
    console.error('[substack] Feed unavailable:', cause);
    return [];
  }
}
