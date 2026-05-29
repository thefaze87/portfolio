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

const TRUST_ORGS = [
  'LifeSurge',
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
        <EyebrowLabel accent={false}>Trusted by organizations including</EyebrowLabel>

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
