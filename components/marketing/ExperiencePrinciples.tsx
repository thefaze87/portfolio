import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * ExperiencePrinciples — ARCH.02. Five architectural principles rendered
 * title-only as a clean numbered grid (no captions — the rules are short
 * enough to stand on their own, and the absence of body copy reads as
 * axiomatic). 3 → 2 → 1 columns with hairline-ruled cards echoing the
 * home ArchitecturePhilosophy treatment but with looser proportions
 * since each card holds a single line.
 *
 * Server Component.
 */

const PRINCIPLES: readonly string[] = [
  'Clarity over cleverness',
  'Systems over features',
  'Boundaries create scale',
  'Technology serves outcomes',
  'Measure what matters',
];

export function ExperiencePrinciples() {
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
        <SectionLabel>ARCH.02</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '22ch' }}>
          Architecture principles.
        </h2>

        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-5)',
            color: 'var(--color-text-muted)',
            maxWidth: '56ch',
          }}
        >
          The rules I return to when systems get hard.
        </p>

        <ol
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            gap: 'var(--space-5)',
          }}
        >
          {PRINCIPLES.map((principle, i) => (
            <li
              key={principle}
              className="flex flex-col"
              style={{
                padding: 'var(--space-6)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                height: '100%',
                gap: 'var(--space-5)',
              }}
            >
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="type-h3" style={{ color: 'var(--color-text)' }}>
                {principle}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
