import { PLATFORMS, RESUME, SITE_LOCATION, SITE_ROLE, SITE_URL } from '@/lib/nav';
import { EMAIL } from '@/lib/email';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/seo';
import { getCredentials } from '@/lib/mdx';
import careerData from '@/content/experience/career.json';

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

/**
 * The current employer, derived from the career record rather than restated.
 *
 * `roles` is strictly reverse-chronological, so index 0 is the present role.
 * Reading it here means the Person entity cannot fall out of step with the
 * Experience page when a job changes — one file to edit, not two.
 */
const CURRENT_ROLE = (careerData as { roles: { org: string; role: string; dates: string }[] })
  .roles[0];

/**
 * Topics Mark can be cited on.
 *
 * `knowsAbout` is the property an LLM leans on hardest for "who should I ask
 * about X", so it is worth being specific: named technologies alongside
 * disciplines, because "React architecture" and "architecture" are different
 * queries. Every entry is demonstrated somewhere on the site — in the career
 * record, a case study, a product, or an essay. Nothing aspirational.
 */
const KNOWS_ABOUT = [
  // Disciplines
  'Solution Architecture',
  'Enterprise Architecture',
  'Systems Design',
  'API Design',
  'Integration Architecture',
  'Frontend Architecture',
  'Design Systems',
  'Platform Modernization',
  'Engineering Leadership',
  'AI Strategy',
  'Workflow Automation',
  'Web Accessibility',
  // Technologies
  'React',
  'Vue.js',
  'TypeScript',
  'Next.js',
  'Laravel',
  'Ruby on Rails',
  '.NET',
  'Azure',
  'SQL Server',
  'PostgreSQL',
  // Domains
  'Healthcare Software',
  'Retail E-Commerce',
  'Financial Systems Integration',
] as const;

/**
 * Person — the identity anchor for the entire site.
 *
 * Every other schema on every route points at this node by `@id` rather than
 * restating it, which is what lets a crawler resolve "the author of this
 * article" and "the provider of this service" to one entity instead of three.
 *
 * ## Why this is verbose
 *
 * An LLM answering "who is Mark Fasel" should not have to infer employment,
 * education, or credentials from prose. Each property below replaces an
 * inference with a stated fact:
 *
 *   worksFor      → current employer, from career.json
 *   hasOccupation → the role itself, with its skills
 *   alumniOf      → degrees, from credentials.json
 *   hasCredential → certifications, from credentials.json
 *   subjectOf     → the résumé, as a retrievable document
 *   image         → a face for entity reconciliation across the web
 *   sameAs        → the profiles that resolve to the same person
 *
 * Everything here traces to published site content or the résumé. Nothing is
 * inferred, rounded, or aspirational.
 *
 * ## Employment history is deliberately NOT here
 *
 * `worksFor` names only the current employer. Listing seven organizations
 * would read as seven concurrent jobs — schema.org has no "past employer"
 * property. The full history lives on /experience as an ItemList of
 * `OrganizationRole` nodes with start and end dates, which is the correct
 * shape for time-bounded relationships, and it links back to this node.
 */
export function personSchema() {
  const { education, certifications } = getCredentials();

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: SITE_ROLE,
    description: SITE_DESCRIPTION,
    // A public alias, never the private inbox — see lib/email.ts. Publishing
    // a contactable address is a strong identity signal; publishing the real
    // one would hand it to every scraper that reads JSON-LD.
    email: `mailto:${EMAIL.public}`,
    image: absoluteUrl('/images/mark-fasel-portrait.png'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_LOCATION.split(',')[0]?.trim(),
      addressRegion: SITE_LOCATION.split(',')[1]?.trim(),
      addressCountry: 'US',
    },
    sameAs: PLATFORMS.map((p) => p.href),

    ...(CURRENT_ROLE
      ? {
          worksFor: {
            '@type': 'Organization',
            name: CURRENT_ROLE.org,
          },
          hasOccupation: {
            '@type': 'Occupation',
            name: CURRENT_ROLE.role,
            occupationalCategory: 'Solutions Architect',
            skills: KNOWS_ABOUT.join(', '),
          },
        }
      : {}),

    // One node per institution rather than per degree — two degrees from the
    // same university is one alumni relationship stated twice otherwise.
    alumniOf: [...new Set(education.map((e) => e.institution))].map((institution) => ({
      '@type': 'CollegeOrUniversity',
      name: institution,
    })),

    hasCredential: [
      ...education.map((e) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: `${e.credential}, ${e.field}`,
        recognizedBy: { '@type': 'CollegeOrUniversity', name: e.institution },
      })),
      ...certifications.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certificate',
        name: c.name,
        recognizedBy: { '@type': 'Organization', name: c.issuer },
        ...(c.url ? { url: c.url } : {}),
      })),
    ],

    knowsAbout: [...KNOWS_ABOUT],
    knowsLanguage: { '@type': 'Language', name: 'English', alternateName: 'en' },

    // The résumé as a retrievable document about this person. Gated on the
    // same flag as the download button, so the graph can never advertise a
    // file that is not published.
    ...(RESUME.available
      ? {
          subjectOf: {
            '@type': 'DigitalDocument',
            name: `${SITE_NAME} — Résumé`,
            url: absoluteUrl(RESUME.href),
            encodingFormat: 'application/pdf',
            about: { '@id': `${SITE_URL}/#person` },
          },
        }
      : {}),

    mainEntityOfPage: { '@id': absoluteUrl('/about#page') },
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

/* ============================================================================
 * Collection pages
 *
 * /experience, /projects, /products, and /writing each enumerate entities.
 * Without an ItemList a crawler sees a page of prose and has to guess at the
 * boundaries between items; with one, the enumeration is stated.
 *
 * Every list references entities that are actually rendered on the page —
 * never a superset, and never a type the content does not support.
 * ========================================================================== */

/**
 * One entry in a collection. Exactly one of the three linkage forms applies:
 *
 *   id    → the entity is declared elsewhere (an Article or
 *           SoftwareApplication on its own detail page). Reference it rather
 *           than describing it twice.
 *   node  → the entity exists only here, so it is embedded inline. Used for
 *           employment roles, which have no page of their own.
 *   url   → there is a destination but no schema node we own, e.g. a post
 *           that lives on Substack.
 */
export interface CollectionItem {
  name: string;
  url?: string;
  id?: string;
  node?: object;
  description?: string;
}

/**
 * CollectionPage wrapping an ItemList.
 *
 * `ItemListOrderAscending` is deliberately not claimed — these lists are
 * curated or reverse-chronological, and asserting an order semantics we do not
 * honour is worse than leaving it unspecified.
 */
export function collectionPageSchema(collection: {
  name: string;
  description: string;
  path: string;
  items: readonly CollectionItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': absoluteUrl(`${collection.path}#page`),
    url: absoluteUrl(collection.path),
    name: collection.name,
    description: collection.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collection.items.length,
      itemListElement: collection.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.node
          ? { item: item.node }
          : item.id
            ? { item: { '@id': item.id } }
            : item.url
              ? { url: absoluteUrl(item.url) }
              : {}),
      })),
    },
  };
}

/**
 * Parse a display date range into schema.org start/end dates.
 *
 * career.json stores human strings ("Nov 2020–Oct 2024", "2014–Present")
 * because that is what renders. Rather than duplicate the same fact in an
 * ISO field that could drift, the machine form is derived here.
 *
 * Returns partial dates ("2020-11"), which schema.org accepts — inventing a
 * day-of-month would be fabricating precision the résumé does not have. An
 * unparseable segment is omitted rather than guessed.
 */
function parseDateRange(range: string): { startDate?: string; endDate?: string } {
  const MONTHS: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };

  const toIso = (part: string): string | undefined => {
    const trimmed = part.trim();
    if (/^present$/i.test(trimmed)) return undefined;

    const withMonth = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(trimmed);
    if (withMonth) {
      const month = MONTHS[(withMonth[1] ?? '').toLowerCase()];
      return month ? `${withMonth[2]}-${month}` : undefined;
    }

    const yearOnly = /^(\d{4})$/.exec(trimmed);
    return yearOnly ? yearOnly[1] : undefined;
  };

  // En dash is the separator used throughout the content files.
  const [start = '', end = ''] = range.split('–');
  const startDate = toIso(start);
  const endDate = toIso(end);

  return { ...(startDate ? { startDate } : {}), ...(endDate ? { endDate } : {}) };
}

/**
 * The employment history, as time-bounded roles.
 *
 * `OrganizationRole` is the schema.org pattern for "this person held this
 * position at this organization between these dates" — the thing a plain
 * `worksFor` array cannot express without implying seven concurrent jobs.
 * A role with no `endDate` is current.
 */
export function employmentItemList(roles: readonly { org: string; role: string; dates: string }[]) {
  return roles.map((entry) => ({
    '@type': 'OrganizationRole',
    roleName: entry.role,
    ...parseDateRange(entry.dates),
    worksFor: { '@type': 'Organization', name: entry.org },
  }));
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
