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

/** Footer nav — primary links plus the secondary engagement routes. */
export const FOOTER_NAV_LINKS: readonly NavLink[] = [
  ...NAV_LINKS,
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Social links. Hrefs are platform-root placeholders — replace with Mark's
 * real profile URLs before launch (intentionally not guessed here).
 */
export const SOCIAL_LINKS: readonly NavLink[] = [
  { href: 'https://www.linkedin.com/', label: 'LinkedIn' },
  { href: 'https://github.com/', label: 'GitHub' },
  { href: 'https://x.com/', label: 'X' },
  { href: 'https://www.youtube.com/', label: 'YouTube' },
];

/**
 * Role line, stored as discrete segments so each role can render in a
 * nowrap span — wrapping then only ever happens *between* roles, never
 * mid-phrase. AI is deliberately absent here so AI strategy can headline
 * the Consulting / About pages rather than being diluted into a footer label.
 */
export const SITE_ROLES: readonly string[] = [
  'Solutions Architect',
  'Engineering Leader',
  'Full-Stack Builder',
  'AI Strategist',
];

/** Joined form for plain-string contexts (metadata, alt text). */
export const SITE_ROLE = SITE_ROLES.join(' · ');

/** Footer copyright location. */
export const SITE_LOCATION = 'Tampa, FL';

/** Primary CTA — destination + label. Reused by Header and any page CTA. */
export const PRIMARY_CTA = { href: '/contact', label: "Let's talk →" } as const;
