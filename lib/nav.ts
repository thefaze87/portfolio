/**
 * Navigation + identity data — single source of truth for the links and
 * metadata that appear in the Header, MobileDrawer, and Footer. Editing
 * one array updates every nav surface.
 */

export type NavLink = { href: string; label: string };

/** Primary nav — Header (desktop) and MobileDrawer. */
export const NAV_LINKS: readonly NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/consulting', label: 'Consulting' },
  { href: '/products', label: 'Products' },
];

/** Footer nav — primary links plus the secondary engagement route.
 *  Newsletter is not here: it's an external platform (Substack), see PLATFORMS. */
export const FOOTER_NAV_LINKS: readonly NavLink[] = [
  ...NAV_LINKS,
  { href: '/contact', label: 'Contact' },
];

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

/** Footer copyright location. */
export const SITE_LOCATION = 'Tampa, FL';

/** Primary CTA — destination + label. Reused by Header and any page CTA. */
export const PRIMARY_CTA = { href: '/contact', label: "Let's talk →" } as const;
