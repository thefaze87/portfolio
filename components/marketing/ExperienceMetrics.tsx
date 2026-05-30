import { SectionLabel } from '@/components/brand/SectionLabel';
import careerData from '@/content/experience/career.json';

/**
 * ExperienceMetrics — EXP.02. An editorial stat grid: big tabular numbers,
 * mono labels, hairline-ruled columns. No icons, no shadowed cards — the
 * figures carry it (2 → 4 columns).
 *
 * The figures here are scope/breadth facts that are honestly derivable, not
 * invented performance metrics: years in the field, the count of roles (read
 * from career.json so it can't drift), industries served (matches
 * IndustriesGrid), and leadership domains (matches EXP.03). Swap in real
 * impact numbers when available.
 *
 * Server Component.
 */

const STATS: readonly { value: string; label: string }[] = [
  { value: '20+', label: 'Years in software' },
  { value: String(careerData.length), label: 'Companies & teams' },
  { value: '9', label: 'Industries served' },
  { value: '4', label: 'Leadership domains' },
];

export function ExperienceMetrics() {
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
        <SectionLabel>EXP.02</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          Two decades, measured.
        </h2>

        <dl
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ margin: 0, marginTop: 'var(--space-8)', columnGap: 'var(--space-7)' }}
        >
          {STATS.map((stat) => (
            // column-reverse keeps valid <dt> → <dd> DOM order while rendering
            // the big number on top and its label beneath.
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: 'var(--space-3)',
                borderTop: 'var(--stroke-thin) solid var(--color-border-strong)',
                paddingBlock: 'var(--space-4)',
              }}
            >
              <dt className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </dt>
              <dd
                className="type-display-lg nums-tabular"
                style={{ margin: 0, color: 'var(--color-text)' }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
