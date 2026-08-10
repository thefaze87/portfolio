import { PLATFORMS, SITE_LOCATION, SITE_ROLE, SITE_URL } from '@/lib/nav';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/seo';

/**
 * JSON-LD builders.
 *
 * These teach search engines and LLM crawlers who Mark is and what the site
 * is — the structured counterpart to the prose on /about. Emitted from the
 * root layout so every page carries the identity graph.
 *
 * Kept as plain builder functions (not inline objects in components) so the
 * same entity data can feed Article, Breadcrumb, and FAQ schemas later
 * without duplication.
 */

/**
 * Serialize a schema object for a <script type="application/ld+json"> tag.
 *
 * `<` is escaped to its unicode form. JSON.stringify alone is not sufficient
 * here: a literal `</script>` anywhere in the data terminates the tag early
 * and everything after it is parsed as HTML. The values on this site are all
 * build-time content, but they include editable JSON (content/about/faq.json)
 * that a non-engineer may touch, so the escape belongs in one place rather
 * than in each caller's head.
 *
 * The escape is valid inside JSON string literals, so consumers parse the
 * identical object.
 */
export function jsonLd(schema: object | object[]): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

/** Person — the identity anchor. `sameAs` is how engines reconcile this site
 *  with the LinkedIn/GitHub/X profiles into one entity. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: SITE_ROLE,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_LOCATION.split(',')[0]?.trim(),
      addressRegion: SITE_LOCATION.split(',')[1]?.trim(),
      addressCountry: 'US',
    },
    sameAs: PLATFORMS.map((p) => p.href),
    knowsAbout: [
      'Solution Architecture',
      'Enterprise Architecture',
      'AI Strategy',
      'Frontend Architecture',
      'Systems Design',
      'Engineering Leadership',
    ],
  };
}

/** WebSite — names the site and binds it to the Person. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}

/**
 * ProfilePage — the newer schema type for "this page is about a person".
 * Google treats it as a stronger identity signal than Person alone, so /about
 * emits both: ProfilePage wrapping the Person node declared at the root.
 */
export function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': absoluteUrl('/about#page'),
    url: absoluteUrl('/about'),
    name: `About ${SITE_NAME}`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
  };
}

/**
 * FAQPage — eligible for rich results, and the structure AI assistants quote
 * most readily. Only emit this where the questions are genuinely visible on
 * the page; marking up hidden content is a guidelines violation.
 */
export function faqSchema(items: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Service — one node per consulting path, each provided by the Person entity.
 *
 * Modelled as two distinct Services rather than one with a long description,
 * because they target genuinely different buyers. Keeping them separate lets a
 * search engine surface the right one for "ai automation consultant" versus
 * "enterprise architecture consultant" instead of averaging the two.
 */
export function servicesSchema(
  paths: readonly { id: string; title: string; audience: string; services: { name: string }[] }[],
) {
  return paths.map((path) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`/consulting#${path.id}`),
    name: path.title,
    description: path.audience,
    provider: { '@id': `${SITE_URL}/#person` },
    areaServed: { '@type': 'Country', name: 'United States' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: path.title,
      itemListElement: path.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    },
  }));
}

/**
 * Article — one per essay and case study.
 *
 * `author` and `publisher` both point at the Person node declared at the root
 * rather than restating it, which is what lets a crawler connect an article to
 * the identity graph instead of treating each page as a separate entity.
 */
export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  section: string;
  /** Set when the article is republished from a platform that owns the
   *  original. Keeps `url` consistent with the rel="canonical" the page emits;
   *  a mismatch between the two is a contradictory signal to a crawler. */
  canonicalUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': absoluteUrl(`${article.path}#article`),
    headline: article.title,
    description: article.description,
    url: article.canonicalUrl ?? absoluteUrl(article.path),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    articleSection: article.section,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

/**
 * SoftwareApplication — one per product.
 *
 * Deliberately not `Article`: these pages describe software that exists (or is
 * being built), not a piece of writing about it. The distinction matters for
 * how search engines and AI assistants classify the entity — an Article about
 * Helixon and Helixon itself are different things, and only the second can
 * surface for "research commerce platform".
 *
 * `offers` is omitted on purpose. Nothing here is priced yet, and an empty or
 * zero-price Offer is worse than none — it signals "free" rather than
 * "unannounced".
 */
export function softwareApplicationSchema(product: {
  id: string;
  name: string;
  tagline: string;
  category: string;
  summary: string;
  status: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': absoluteUrl(`/products/${product.id}#product`),
    name: product.name,
    alternateName: product.tagline,
    applicationCategory: product.category,
    description: product.summary,
    url: absoluteUrl(`/products/${product.id}`),
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    // Lifecycle stated as a creative-work status rather than invented into a
    // release version we do not have.
    creativeWorkStatus: product.status,
  };
}

/**
 * BreadcrumbList for nested routes. Home is prepended automatically so callers
 * only describe the part of the trail that is specific to their page.
 */
export function breadcrumbSchema(trail: readonly { name: string; path: string }[]) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** ContactPage — marks /contact as the canonical way to reach Mark. */
export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': absoluteUrl('/contact#page'),
    url: absoluteUrl('/contact'),
    name: `Contact ${SITE_NAME}`,
    about: { '@id': `${SITE_URL}/#person` },
  };
}
