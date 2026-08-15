'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isActivePath, type NavLink } from '@/lib/nav';

/**
 * Header navigation islands — the primary links and the CTA, both of which
 * need to know the current route.
 *
 * ## Why these are Client Components
 *
 * There is no server-side equivalent of `usePathname` in the App Router: a
 * Server Component cannot know which route is rendering inside it. The
 * alternative is middleware stamping the path onto a request header and the
 * layout reading it back, which is a lot of moving parts for a nav highlight.
 *
 * So these are islands, kept as small as the rule in CLAUDE.md intends —
 * scope the client boundary to the interactive part, never the page. They
 * hold no state, run no effects, and ship little more than the link list. The
 * Header around them stays a Server Component.
 *
 * ## The active treatment is not colour alone
 *
 * Inactive links sit at --color-text-muted and brighten to --color-text on
 * hover. If "active" were only full-strength text it would be indistinguishable
 * from a link the mouse happens to be over. The underline is what separates
 * "you are here" from "you are hovering", and it is the 1px underline the brand
 * spec already sanctions rather than a new device.
 *
 * The underline is --color-text-muted, NOT --color-border-strong. The border
 * token is #3A3A3A against a #0A0A0A header — about 1.5:1, which renders as
 * nothing at all on most displays. A state nobody can see is not a state.
 * Muted clears 7:1 while still sitting below the label, so it reads as a rule
 * under the word rather than competing with it.
 *
 * Deliberately NOT orange: the header is sticky, so it is in every viewport on
 * the site, and accent here would spend the one-orange-per-viewport budget that
 * belongs to in-page primary actions. See the Header docblock.
 *
 * `aria-current="page"` carries the meaning for assistive tech, so the state is
 * never conveyed by styling alone.
 */

/** Shared underline treatment, so the links and the CTA cannot drift apart. */
const ACTIVE_UNDERLINE = {
  textDecoration: 'underline',
  textDecorationColor: 'var(--color-text-muted)',
  textUnderlineOffset: '0.4em',
} as const;

export function PrimaryNav({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden items-center md:flex"
      style={{ gap: 'var(--space-6)' }}
    >
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className="nav-link type-body-sm"
            style={active ? { color: 'var(--color-text)', ...ACTIVE_UNDERLINE } : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The header's "Let's Talk →" button, which is a destination as well as a
 * call to action — so on /contact it should say so rather than inviting a
 * visitor to click through to the page they are already reading.
 *
 * The treatment is a strengthened border rather than the links' underline: an
 * underlined label inside a bordered control reads as a mistake. `.cta-ghost`
 * borders at --color-border-strong; active lifts it to --color-text-muted,
 * which is a large luminance jump rather than a hue change, so it survives
 * colour-vision deficiency. `aria-current` covers the non-visual channel.
 */
export function HeaderCta({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Button
      href={href}
      variant="ghost"
      size="sm"
      className={className}
      aria-current={active ? 'page' : undefined}
      style={active ? { borderColor: 'var(--color-text-muted)' } : undefined}
    >
      {label}
    </Button>
  );
}
