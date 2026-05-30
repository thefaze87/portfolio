import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * ExperienceLeadership — EXP.03. Expertise grouped by the outcome it serves
 * rather than by tool or framework: Architecture, Engineering, AI, Product
 * Strategy. Four bordered, flat cards (4 → 2 → 1) echoing the home
 * ArchitecturePhilosophy grid; each lists capabilities as a hairline-ruled
 * index. No icons, no logos, no shadows.
 *
 * Server Component. Group names are h3 (page order h1 → h2 → h3).
 */

const GROUPS: readonly { n: string; title: string; items: readonly string[] }[] = [
  {
    n: '01',
    title: 'Architecture',
    items: [
      'System design & integration',
      'Platform & API strategy',
      'Scalability & resilience',
      'Technical decision frameworks',
    ],
  },
  {
    n: '02',
    title: 'Engineering',
    items: [
      'Front-end architecture',
      'Design systems & components',
      'Performance & accessibility',
      'Full-stack delivery',
    ],
  },
  {
    n: '03',
    title: 'AI',
    items: [
      'Applied AI strategy',
      'LLM integration & tooling',
      'AI-assisted workflows',
      'Pragmatic, intentional adoption',
    ],
  },
  {
    n: '04',
    title: 'Product Strategy',
    items: [
      'Roadmap & prioritization',
      'Cross-functional alignment',
      'UX & product thinking',
      'Outcomes over output',
    ],
  },
];

export function ExperienceLeadership() {
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
        <SectionLabel>EXP.03</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          Technology leadership, by outcome.
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
        >
          {GROUPS.map((group) => (
            <article
              key={group.title}
              className="flex flex-col"
              style={{
                padding: 'var(--space-6)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                height: '100%',
              }}
            >
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {group.n}
              </span>
              <h3 className="type-h3" style={{ marginTop: 'var(--space-5)' }}>
                {group.title}
              </h3>

              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                }}
              >
                {group.items.map((item, idx) => (
                  <li
                    key={item}
                    className="type-body-sm"
                    style={{
                      color: 'var(--color-text-muted)',
                      paddingBlock: 'var(--space-3)',
                      borderTop:
                        idx === 0 ? 'none' : 'var(--stroke-hairline) solid var(--color-border)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
