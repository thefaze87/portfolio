import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { PRIMARY_CTA, PRIMARY_NAV } from '@/lib/nav';

/**
 * Header — sticky site header. Mark only (no wordmark, per the finalized
 * placement rules): the monogram-era "logo + wordmark" lockup is reserved
 * for the footer. 64px tall on mobile, 80px on desktop.
 *
 * Server Component. The only interactive island is the MobileDrawer (the
 * hamburger + dialog), shown below the `md` breakpoint. The "Let's talk →"
 * CTA is a ghost/bordered button, not orange — a sticky header is always in
 * the viewport, and an orange CTA here would consume the site-wide
 * one-orange-per-viewport budget meant for in-page primary actions.
 *
 * First focusable element is the skip-to-content link (a11y).
 */
export function Header() {
  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'var(--color-bg)',
        borderBottom: 'var(--stroke-hairline) solid var(--color-border)',
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        style={{
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        Skip to content
      </a>

      <div
        className="mx-auto flex h-16 items-center justify-between md:h-20"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
        }}
      >
        <Link href="/" aria-label="Mark Fasel — home" className="inline-flex items-center">
          <Logo height={28} />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center md:flex"
          style={{ gap: 'var(--space-6)' }}
        >
          {PRIMARY_NAV.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link type-body-sm">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
          <Button
            href={PRIMARY_CTA.href}
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            {PRIMARY_CTA.label}
          </Button>
          <MobileDrawer links={PRIMARY_NAV} className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
