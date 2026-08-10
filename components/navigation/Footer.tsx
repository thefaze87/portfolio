import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Wordmark } from '@/components/brand/Wordmark';
import { RoleLine } from '@/components/navigation/RoleLine';
import { FOOTER_NAV_LINKS, PLATFORMS, SITE_LOCATION } from '@/lib/nav';
import { GENERAL_INQUIRY } from '@/lib/email';

/**
 * Footer — restrained brand lockup + nav + social, with a fine-print bar.
 *
 * Layout intent:
 *   - Reduced lockup footprint (small mark + sm wordmark) so the footer
 *     reads premium, not oversized.
 *   - Top region: lockup and nav/social sit in a row on desktop, stacked
 *     on mobile. Nav is a clean 2-column grid.
 *   - Bottom region (below nav/social, separated by a hairline): the role
 *     line + copyright as quiet fine print. The role line renders via
 *     <RoleLine>, so it can only break between roles — no mid-phrase wrap.
 *
 * Server Component. Fine print uses --color-text-muted (AA-clean at 11px).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: 'var(--stroke-hairline) solid var(--color-border)',
        marginTop: 'var(--space-10)',
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--space-8)',
          gap: 'var(--space-8)',
        }}
      >
        {/* Top: lockup + nav/social */}
        <div
          className="flex flex-col justify-between md:flex-row"
          style={{ gap: 'var(--space-8)' }}
        >
          {/* Lockup. Cap-center already sits at the mark's geometric center
           * (verified ~0.25px), but the mark is bottom-heavy (the filled
           * peak), so the wordmark is nudged 1px down onto the mark's optical
           * center. Purely an optical alignment of two brand elements. */}
          <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <Logo height={28} />
            <span style={{ display: 'inline-flex', transform: 'translateY(1px)' }}>
              <Wordmark size="sm" />
            </span>
          </div>

          {/* Nav + social */}
          <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
            <nav aria-label="Footer">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 'var(--space-3) var(--space-8)',
                }}
              >
                {FOOTER_NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-link type-body-sm">
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Direct email. Sits with the nav rather than in the fine print
             * because it is a real contact path, not metadata. The address is
             * rendered as text (readable, copyable) inside the mailto — a
             * visitor with no configured mail client can still read and copy
             * it, which a "Email me" label would not allow. */}
            <a
              href={GENERAL_INQUIRY.href}
              className="nav-link type-body-sm"
              style={{ justifySelf: 'start' }}
            >
              {GENERAL_INQUIRY.address}
            </a>

            <ul
              aria-label="Platforms"
              className="flex flex-wrap"
              style={{ gap: 'var(--space-5)', listStyle: 'none', margin: 0, padding: 0 }}
            >
              {PLATFORMS.map((platform) => (
                <li key={platform.label}>
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link type-mono-label"
                  >
                    {platform.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: fine-print bar — role line + copyright, below nav/social */}
        <div
          className="flex flex-col"
          style={{
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <RoleLine />
          <p className="type-mono-label" style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            © {year} Mark Fasel · {SITE_LOCATION}
          </p>
        </div>
      </div>
    </footer>
  );
}
