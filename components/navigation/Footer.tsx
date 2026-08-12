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
          // space-7, not space-8: the fine-print bar carries its own
          // paddingTop above the hairline, so a space-8 gap here stacked with
          // it into ~112px of empty column below the nav.
          gap: 'var(--space-7)',
        }}
      >
        {/* Top: nav + lockup on the left, contact + platforms on the right */}
        <div
          className="flex flex-col justify-between md:flex-row"
          style={{ gap: 'var(--space-8)' }}
        >
          {/* Left column: navigation, then the lockup beneath it.
           *
           * Nav first is the deliberate order. The lockup is a sign-off, not a
           * heading — putting the wordmark last lets the brand close the
           * column the way a signature closes a letter, and it puts the links
           * at the top of the block where a visitor who scrolled here to
           * navigate meets them first.
           *
           * It also aligns the two columns at the top: nav and the contact
           * prompt now start on the same line, so the footer reads as two
           * parallel blocks rather than one tall one beside one short one.
           *
           * ## The order flips back on mobile
           *
           * Stacked in a single column, nav-then-lockup buries the brand mark
           * in the middle of the footer, so below md the two swap back via
           * flex `order` and the lockup leads again.
           *
           * Reordering with CSS normally risks splitting visual order from
           * focus order (WCAG 2.4.3). It is safe here for a specific reason:
           * the lockup is not a link. The mark and wordmark in the footer are
           * inert — the block contains zero focusable elements — so there is
           * no tab stop to get out of sequence. If the lockup is ever made
           * clickable, this reorder has to go.
           *
           * `md:flex-1` — the column grows to fill whatever the contact column
           * does not use. Without it the column is content-sized, the nav hugs
           * the left edge, and `justify-between` dumps the remainder into a
           * single void in the middle. Growing the column lets the nav grid
           * distribute across it instead. */}
          <div className="flex flex-col md:min-w-0 md:flex-1" style={{ gap: 'var(--space-7)' }}>
            {/* ## Why the column count changes at lg
             *
             * Two columns held the seven links in four rows and roughly 350px
             * of a 1280px container. That produced both desktop problems at
             * once: `justify-between` had ~490px of nothing to distribute, and
             * the block was 100px taller than it needed to be.
             *
             * Four columns at lg lays the same links out in two rows and about
             * 780px, which absorbs the gap and shortens the footer. Reading
             * order is unchanged — the grid flows by row, so it still reads
             * Experience → Projects → Products → Writing, then Consulting →
             * About → Let's Talk.
             *
             * At lg the columns are `1fr` and the parent grows, so the nav
             * distributes across the column rather than hugging its left edge.
             * Mobile keeps two `max-content` columns so the links stay paired
             * tightly instead of stretching across a phone screen. */}
            <nav aria-label="Footer" className="order-2 md:order-1">
              <div
                className="grid grid-cols-[repeat(2,max-content)] lg:grid-cols-4"
                style={{ gap: 'var(--space-4) var(--space-8)', maxWidth: '46rem' }}
              >
                {FOOTER_NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-link type-body-sm">
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

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
            <div className="order-1 flex flex-col md:order-2" style={{ gap: 'var(--space-2)' }}>
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
          </div>

          {/* Contact column */}
          <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
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
           * footer navigation above.
           *
           * They use `prose-link`, NOT `nav-link`. `nav-link` resolves to
           * --color-text-muted, which is the exact colour of the copyright
           * text wrapping them — so the links were literally indistinguishable
           * from the plain text around them and read as part of the copyright
           * string. `prose-link` is the site's established treatment for a
           * link sitting inside a line of prose: full-strength text plus a
           * hairline underline. That gives an affordance that does not depend
           * on colour alone, which is what WCAG 1.4.1 asks for when a link is
           * embedded in surrounding text. */}
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
                <Link href={link.href} className="prose-link">
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
