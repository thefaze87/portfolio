import { Fragment } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Wordmark } from '@/components/brand/Wordmark';
import { RoleLine } from '@/components/navigation/RoleLine';
import {
  FOOTER_NAV_LINKS,
  LEGAL_ENTITY,
  LEGAL_NAV_LINKS,
  PLATFORMS,
  PRIMARY_CTA,
  SITE_LOCATION,
} from '@/lib/nav';
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
 *     line + copyright/legal as quiet fine print. The role line renders via
 *     <RoleLine>, so it can only break between roles — no mid-phrase wrap.
 *
 * ## The brand / entity relationship
 *
 * The lockup reads as a hierarchy, not a substitution:
 *
 *     MARK FASEL          ← the brand. Unchanged, and it stays the wordmark.
 *     Mark Fasel, LLC     ← the entity behind it. Quieter, one step down.
 *
 * The personal brand is what people search for and remember; the LLC is who
 * they contract with. Replacing the first with the second is how a personal
 * site starts reading as an agency, so the company name is set at mono-label
 * scale in muted grey — present for the reader who needs it, invisible to
 * everyone else. No descriptor line sits under it: <RoleLine> in the fine
 * print already carries that, and two taglines inside one footer is one too
 * many.
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
          {/* Lockup + legal entity. Cap-center already sits at the mark's
           * geometric center (verified ~0.25px), but the mark is bottom-heavy
           * (the filled peak), so the wordmark is nudged 1px down onto the
           * mark's optical center. Purely an optical alignment of two brand
           * elements.
           *
           * The entity line is indented to the wordmark's left edge — mark
           * width (28px × 1.374 ratio) plus the space-3 gap — so it hangs off
           * the wordmark rather than off the mark. Aligning it to the mark
           * instead would read as a third element in the lockup rather than a
           * subtitle to the name. */}
          <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
            <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
              <Logo height={28} />
              <span style={{ display: 'inline-flex', transform: 'translateY(1px)' }}>
                <Wordmark size="sm" />
              </span>
            </div>
            <span
              className="type-mono-label"
              style={{
                color: 'var(--color-text-muted)',
                paddingInlineStart: 'calc(28px * 1.374 + var(--space-3))',
              }}
            >
              {LEGAL_ENTITY.name}
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

            {/* Contact block: prompt → primary path → direct address.
             *
             * The prompt names both audiences in one line. The site has two
             * kinds of visitor reaching the footer — someone with a project
             * and someone with a role — and a single "Have a project in mind?"
             * would quietly exclude half of them.
             *
             * `cta-text` is white at rest and only warms to accent on hover,
             * so this adds a conversion path without spending the page's one
             * orange interactive element. /contact stays the destination; the
             * mailto below it is the escape hatch for people who prefer their
             * own client. The address is the link text so it stays readable
             * and copyable even where no mail client is configured. */}
            <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
              <p className="type-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Have a project or opportunity in mind?
              </p>
              <Link
                href={PRIMARY_CTA.href}
                className="cta-text type-body-sm"
                style={{ justifySelf: 'start' }}
              >
                Let&apos;s talk →
              </Link>
              <a
                href={GENERAL_INQUIRY.href}
                className="nav-link type-body-sm"
                style={{ justifySelf: 'start' }}
              >
                {GENERAL_INQUIRY.address}
              </a>
            </div>

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

        {/* Bottom: fine-print bar — role line + copyright, below nav/social.
         *
         * The copyright names the legal entity, not the person. Three reasons
         * it belongs here and only here:
         *
         *   - The wordmark above stays "MARK FASEL". That is the brand mark;
         *     the logo system does not admit a second form, and stamping a
         *     company name into a lockup is how a personal site starts reading
         *     as an agency.
         *   - Fine print is where a legal entity is expected. Stating it in
         *     the copyright line is the understated placement — the reader who
         *     needs it finds it, and nobody else notices.
         *   - The role line directly above already carries the descriptor. A
         *     second "Architecture · AI · Product Development" line would put
         *     two taglines in four inches of footer.
         *
         * Name comes from LEGAL_ENTITY so the footer and the Organization
         * JSON-LD node cannot disagree. */}
        <div
          className="flex flex-col"
          style={{
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <RoleLine />

          {/* Legal row. One line at desktop, wrapping at the separators on
           * narrow screens — the separators are aria-hidden so a screen reader
           * hears "© 2026 Mark Fasel, LLC Palmetto, FL Privacy Terms" rather
           * than a run of middle dots.
           *
           * Privacy and Terms are links inside the copyright line rather than
           * a second nav block, which is what keeps them subordinate to the
           * footer navigation above. */}
          <p
            className="type-mono-label flex flex-wrap"
            style={{ color: 'var(--color-text-muted)', margin: 0, gap: '0 var(--space-2)' }}
          >
            <span>
              © {year} {LEGAL_ENTITY.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{SITE_LOCATION}</span>
            {LEGAL_NAV_LINKS.map((link) => (
              <Fragment key={link.href}>
                <span aria-hidden="true">·</span>
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
