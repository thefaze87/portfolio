import { EyebrowLabel } from '@/components/brand/EyebrowLabel';

/**
 * TrustBar — credibility row beneath the hero. Organization names only, no
 * logos (per the imagery diet: no stock/vendor marks). Names are set in
 * Cabinet Grotesk (the display face) at a restrained size and muted color —
 * editorial weight without shouting. Fraunces is reserved for the hero h1,
 * so it isn't used here.
 *
 * Server Component. A <section> without an aria-label is sectioning only,
 * not a landmark — keeps the homepage landmark set clean (banner / main /
 * contentinfo).
 */

/**
 * Curated, not derived from career.json — LawLytics and Roghnu are real roles
 * but carry no recognition for a visitor scanning for five seconds, and a
 * trust bar that lists everything stops being a trust bar.
 *
 * Names must match the career record exactly. "LifeSurge" was written here as
 * one word while every other surface — career.json, the timeline, the résumé,
 * the Person entity's `worksFor` — says "Life Surge". A visitor comparing the
 * homepage to the résumé would have found two spellings of the current
 * employer.
 */
const TRUST_ORGS = [
  'Life Surge',
  'Ramsey Solutions',
  "Johns Hopkins All Children's Hospital",
  'Publix',
  'Scorpion',
] as const;

export function TrustBar() {
  return (
    <section>
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--space-7)',
          borderTop: 'var(--stroke-hairline) solid var(--color-border)',
        }}
      >
        {/* "Trusted by organizations including" implied these were clients.
         * They are employers — the work is real, the framing was not. Naming
         * it accurately costs nothing in credibility and removes a claim that
         * would not survive a recruiter cross-checking it against the résumé. */}
        <EyebrowLabel accent={false}>Systems and platforms built for</EyebrowLabel>

        <ul
          className="flex flex-wrap"
          style={{
            gap: 'var(--space-4) var(--space-7)',
            marginTop: 'var(--space-5)',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {TRUST_ORGS.map((org) => (
            <li
              key={org}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 17,
                color: 'var(--color-text-muted)',
              }}
            >
              {org}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
