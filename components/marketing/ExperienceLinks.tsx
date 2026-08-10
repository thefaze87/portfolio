import Link from 'next/link';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { LINKEDIN_HREF, RESUME } from '@/lib/nav';
import { OPPORTUNITY_INQUIRY } from '@/lib/email';

/**
 * ExperienceLinks — EXP.05. The page's closing editorial callout.
 *
 * Deliberately NOT a CTA bar. This sits at the end of a long career record, so
 * the reader arriving here has already decided they're interested; the job is
 * to hand them the next artifact, not to sell. Three quiet rows, no filled
 * buttons, no orange at rest — the page above is the argument, this is just the
 * index to it.
 *
 * Each row states what the thing actually is, because "Download Résumé" and
 * "View LinkedIn" are not interchangeable and a recruiter is usually after one
 * specific one. LinkedIn is framed as the *complete public profile* — the
 * superset, including recommendations the site deliberately doesn't reproduce.
 *
 * The résumé row renders only when RESUME.available is true, the same gating
 * discipline as `published` in lib/nav.ts. It is a plain <a>, not next/link:
 * the target is a static PDF, and routing it through Link would prefetch a
 * 73KB binary that most visitors never open.
 *
 * Server Component.
 */

interface ClosingLink {
  label: string;
  href: string;
  /** Mono kicker — the artifact type, so the three rows are distinguishable
   *  at a glance rather than reading as three synonyms for "contact me". */
  kind: string;
  description: string;
  external?: boolean;
  download?: boolean;
}

const LINKS: ClosingLink[] = [
  ...(RESUME.available
    ? [
        {
          label: 'Download résumé',
          href: RESUME.href,
          kind: 'PDF',
          description:
            'The two-page record — roles, dates, outcomes, and the stack behind each one.',
          download: true,
        },
      ]
    : []),
  {
    label: 'View full LinkedIn profile',
    href: LINKEDIN_HREF,
    kind: 'Profile',
    description:
      'The complete public career profile, including recommendations and the roles in full detail.',
    external: true,
  },
  {
    label: "Let's talk",
    href: '/contact',
    kind: 'Direct',
    description: 'For a role, an engagement, or a second opinion on a decision you are weighing.',
  },
];

export function ExperienceLinks() {
  return (
    <section>
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--section-py)',
          borderTop: 'var(--stroke-hairline) solid var(--color-border)',
        }}
      >
        <SectionLabel>EXP.05</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '22ch' }}>
          Looking for the complete picture?
        </h2>

        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-5)',
            maxWidth: '56ch',
            color: 'var(--color-text-muted)',
          }}
        >
          Three ways to go deeper than a page can carry.
        </p>

        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-7)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {LINKS.map((link) => (
            <li
              key={link.href}
              className="grid grid-cols-1 sm:grid-cols-[7rem_1fr]"
              style={{
                gap: 'var(--space-2) var(--space-6)',
                paddingBlock: 'var(--space-5)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
              }}
            >
              <span
                className="type-mono-label"
                style={{ color: 'var(--color-text-dim)', paddingTop: 'var(--space-1)' }}
              >
                {link.kind}
              </span>

              <span>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-text type-body-lg inline-flex items-center"
                  >
                    {link.label} →<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : link.download ? (
                  // Plain anchor, not next/link — see the note above.
                  <a
                    href={link.href}
                    download
                    className="cta-text type-body-lg inline-flex items-center"
                  >
                    {link.label} →
                  </a>
                ) : (
                  <Link href={link.href} className="cta-text type-body-lg inline-flex items-center">
                    {link.label} →
                  </Link>
                )}

                <span
                  className="type-body"
                  style={{
                    display: 'block',
                    marginTop: 'var(--space-2)',
                    color: 'var(--color-text-muted)',
                    maxWidth: '54ch',
                  }}
                >
                  {link.description}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* Recruiter-intent direct email. This section closes the career
         * record, so a visitor reaching it with an employment enquiry is the
         * one case where opportunities@ is the right address — it arrives
         * pre-sorted away from consulting and general mail. Deliberately not
         * added anywhere else; the alias exists for this surface only. */}
        <p
          style={{
            marginTop: 'var(--space-7)',
            paddingTop: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <span className="type-body" style={{ color: 'var(--color-text-muted)' }}>
            Hiring? Email{' '}
          </span>
          <a href={OPPORTUNITY_INQUIRY.href} className="prose-link type-body">
            {OPPORTUNITY_INQUIRY.address}
          </a>
        </p>
      </div>
    </section>
  );
}
