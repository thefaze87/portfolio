import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * IndustriesGrid — EXP.02. The breadth of domains, as an editorial index:
 * typography-driven, hairline-ruled grid (3 → 2 → 1 columns). No icons, no
 * logos, no shadows — the names carry it. Server Component.
 */

const INDUSTRIES = [
  'Healthcare',
  'Retail',
  'Ecommerce',
  'Events',
  'Education',
  'Media',
  'SaaS',
  'Enterprise Software',
  'AI',
] as const;

export function IndustriesGrid() {
  return (
    <section>
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--space-10)',
          borderTop: 'var(--stroke-hairline) solid var(--color-border)',
        }}
      >
        <SectionLabel>EXP.02</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          Industries and systems I&apos;ve helped build.
        </h2>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            columnGap: 'var(--space-7)',
          }}
        >
          {INDUSTRIES.map((name) => (
            <li
              key={name}
              className="type-h2"
              style={{
                color: 'var(--color-text)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                paddingBlock: 'var(--space-5)',
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
