/**
 * Navigation + identity data — single source of truth for the links and
 * metadata that appear in the Header, MobileDrawer, and Footer. Editing
 * one array updates every nav surface.
 *
 * ## Published-route gating
 *
 * Every nav entry carries `published`. Surfaces render only published links,
 * so a route can be defined here (locking its URL, label, and order) long
 * before the page exists — without ever shipping a link to a 404.
 *
 * To launch a page: build the route, flip `published` to true. That's the
 * whole checklist. Never flip it before the route renders.
 */

export type NavLink = {
  href: string;
  label: string;
  /** False until the route actually renders. Unpublished links are defined
   *  (URL + order locked) but never rendered by any nav surface. */
  published: boolean;
};

/**
 * Primary nav.
 *
 *   Experience · Projects · Products · Writing · Consulting · About   [ Let's Talk → ]
 *
 * Experience and Projects are both first-class and deliberately separate —
 * they answer different questions and reinforce each other:
 *
 *   Experience = what was accomplished professionally over 20+ years.
 *   Projects   = what gets architected, built, and shipped independently.
 *
 * Collapsing them into one page loses the differentiator, which is the
 * combination. Experience order-first: the career record is the credibility
 * that makes the independent projects read as inevitable rather than hobbyist.
 *
 * Home is the logo, not a nav item. Contact is the CTA, not a nav item.
 * `/products` is now live: Helixon is Launching, which is the condition the
 * approved IA set for admitting it. Products are ventures Mark OWNS; Projects
 * is work he was hired to do. That ownership line is the whole distinction —
 * Helixon, Opsly, Clue Finder, and TrustLaunch moved from Projects to Products
 * when it was drawn.
 */
const PRIMARY_NAV_TARGET: readonly NavLink[] = [
  { href: '/experience', label: 'Experience', published: true },
  { href: '/projects', label: 'Projects', published: true },
  { href: '/products', label: 'Products', published: true },
  { href: '/writing', label: 'Writing', published: true },
  { href: '/consulting', label: 'Consulting', published: true },
  { href: '/about', label: 'About', published: true },
];

/** The career/leadership record. A primary-nav member again. */
export const EXPERIENCE_LINK: NavLink = {
  href: '/experience',
  label: 'Experience',
  published: true,
};

/** The independent build record. */
export const PROJECTS_LINK: NavLink = {
  href: '/projects',
  label: 'Projects',
  published: true,
};

/** Primary nav as rendered by Header + MobileDrawer (published entries only). */
export const PRIMARY_NAV: readonly NavLink[] = PRIMARY_NAV_TARGET.filter((link) => link.published);

/**
 * Whether a nav entry represents the page currently being viewed.
 *
 * Section-aware rather than exact-match: /products/project-atlas keeps
 * "Products" marked, and /writing/some-essay keeps "Writing" marked. A visitor
 * three levels into a section has not left it, and a nav that forgets where
 * they are is worse than one with no active state at all.
 *
 * The trailing slash in the prefix test is load-bearing — a bare
 * `startsWith('/product')` would mark Products active on a hypothetical
 * /production route. Root is exact-only for the same reason: every path
 * starts with '/'.
 *
 * Shared by the desktop nav and the mobile drawer so the two can never
 * disagree about which section you are in.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Footer nav — the site index. Carries the CTA route the header renders as a
 * button rather than a link.
 */
export const FOOTER_NAV_LINKS: readonly NavLink[] = [
  ...PRIMARY_NAV_TARGET,
  { href: '/contact', label: "Let's Talk", published: true },
].filter((link) => link.published);

/**
 * The newsletter publication. Subscriptions + delivery are owned by Substack
 * (no native capture forms yet); the site funnels visitors here directly.
 */
export const NEWSLETTER = {
  name: 'Designing Modern Systems',
  href: 'https://designingmodernsystems.substack.com/',
} as const;

/**
 * External platforms. Newsletter (Substack) and LinkedIn are the primary
 * channels the site funnels toward; ordered by that priority. All open in a
 * new tab. `primary` is available for surfaces that want to emphasize the
 * lead channels.
 *
 * ## `active` gates rendering, exactly like `published` gates routes
 *
 * A platform link is a promise that there is something worth clicking to. An
 * empty channel is worse than an absent one: it costs a visitor a click to
 * learn nothing, and in JSON-LD a `sameAs` pointing at a dormant profile is a
 * weak identity signal rather than a strong one.
 *
 * YouTube is defined here — URL and position locked — but inactive, because
 * there is no channel we intend to promote yet. Flip `active` to true the day
 * there is one, and it appears in the footer, in `Person.sameAs`, and in
 * llms.txt at once. Never flip it before the channel has content.
 */
export type Platform = { href: string; label: string; primary?: boolean; active: boolean };

const PLATFORMS_TARGET: readonly Platform[] = [
  { href: NEWSLETTER.href, label: 'Newsletter', primary: true, active: true },
  { href: 'https://linkedin.com/in/markfasel', label: 'LinkedIn', primary: true, active: true },
  { href: 'https://www.youtube.com/@DesigningModernSystems', label: 'YouTube', active: false },
  { href: 'https://github.com/thefaze87', label: 'GitHub', active: true },
  { href: 'https://x.com/markfasel', label: 'X', active: true },
];

/** Platforms as rendered and as published to the knowledge graph. */
export const PLATFORMS: readonly Platform[] = PLATFORMS_TARGET.filter((p) => p.active);

/**
 * Legal routes. Kept out of PRIMARY_NAV and FOOTER_NAV_LINKS on purpose —
 * these belong in the footer's fine-print row, visually subordinate to
 * navigation, not competing with it.
 */
export const LEGAL_NAV_LINKS: readonly NavLink[] = [
  { href: '/privacy', label: 'Privacy', published: true },
  { href: '/terms', label: 'Terms', published: true },
].filter((link) => link.published);

/** LinkedIn, resolved once — several sections link to it directly. */
export const LINKEDIN_HREF =
  PLATFORMS.find((p) => p.label === 'LinkedIn')?.href ?? 'https://linkedin.com/in/markfasel';

/**
 * Résumé download.
 *
 * `available` gates the download button the same way `published` gates nav
 * links — never render a link to a PDF that isn't there.
 *
 * The filename is deliberately stable and undated. Résumés get bookmarked,
 * forwarded, and pasted into ATS notes; a dated filename turns every refresh
 * into a dead link for everyone holding the old one. Replace the file in
 * place, keep the URL.
 *
 * Source of truth is the "Senior / Staff Software Engineer | Solutions
 * Architect" master. Exactly one résumé is published — role-tailored variants
 * stay off the site, because a visitor who finds two different titles for the
 * same person stops trusting both.
 */
export const RESUME = {
  href: '/documents/mark-fasel-resume.pdf',
  available: true,
} as const;

/**
 * Role line, stored as discrete segments so each role can render in a
 * nowrap span — wrapping then only ever happens *between* roles, never
 * mid-phrase. "Systems Thinker" anchors the systems/architecture/AI
 * positioning the site is built around.
 */
export const SITE_ROLES: readonly string[] = [
  'Solutions Architect',
  'Engineering Leader',
  'Systems Thinker',
  'AI Strategist',
];

/** Joined form for plain-string contexts (metadata, alt text). */
export const SITE_ROLE = SITE_ROLES.join(' · ');

/** Footer copyright location. Matches the résumé header exactly — the two are
 *  read side by side often enough that a mismatch reads as carelessness. */
export const SITE_LOCATION = 'Palmetto, FL';

/**
 * The legal entity behind the practice.
 *
 * Deliberately separate from the personal name and from the brand wordmark:
 *
 *   - The wordmark stays "MARK FASEL". It is the brand mark, and the logo
 *     system (docs/components/wordmark.md) does not admit a second form.
 *   - The LLC belongs in the fine print, where a legal entity belongs. That is
 *     the only place the footer states it.
 *   - In JSON-LD the two are separate nodes — a Person and an Organization
 *     joined by `founder`. Collapsing them (giving the Organization the
 *     person's name, profiles, or portrait) would leave a crawler unable to
 *     tell whether "Mark Fasel" is a human or a company, which is exactly the
 *     ambiguity this phase exists to remove.
 *
 * `foundingYear` matches the start of the parallel practice in
 * content/experience/career.json. If one moves, move the other.
 */
export const LEGAL_ENTITY = {
  name: 'Mark Fasel, LLC',
  foundingYear: '2014',
} as const;

/**
 * Canonical origin — the single source of truth for every absolute URL.
 *
 * markfasel.DEV, matching the domain every email alias uses. Changing this one
 * constant moves metadata, canonical tags, OpenGraph, Twitter cards, the
 * sitemap, robots.txt, all JSON-LD, and both transactional email templates.
 * Nothing else in the codebase hardcodes an origin — keep it that way.
 */
export const SITE_URL = 'https://markfasel.dev';

/**
 * Primary CTA — /contact is the canonical route; "Let's Talk" is the label
 * shown everywhere in the UI.
 */
export const PRIMARY_CTA = { href: '/contact', label: "Let's Talk →" } as const;
