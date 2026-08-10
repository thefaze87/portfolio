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
 */
export type Platform = { href: string; label: string; primary?: boolean };
export const PLATFORMS: readonly Platform[] = [
  { href: NEWSLETTER.href, label: 'Newsletter', primary: true },
  { href: 'https://linkedin.com/in/markfasel', label: 'LinkedIn', primary: true },
  { href: 'https://www.youtube.com/@DesigningModernSystems', label: 'YouTube' },
  { href: 'https://github.com/thefaze87', label: 'GitHub' },
  { href: 'https://x.com/markfasel', label: 'X' },
];

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
