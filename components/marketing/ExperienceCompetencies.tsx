/**
 * ExperienceCompetencies — the strip directly below the hero. Six
 * competency labels (not numeric metrics) as a typographic credibility
 * row before the case studies begin. No section label, no headline —
 * intentionally minimal so it reads as a transition between the
 * positioning hero and the substantive timeline below.
 *
 * Layout: 3 columns at desktop (→ 2 sm → 1 mobile). Each item is mono
 * index + competency label, hairline-ruled at the top, echoing the
 * home IndustriesGrid pattern.
 *
 * Server Component.
 */

const COMPETENCIES: readonly string[] = [
  '20+ Years Experience',
  'Enterprise Systems',
  'Frontend Leadership',
  'AI-Augmented Engineering',
  'Platform Architecture',
  'Business Outcomes',
];

export function ExperienceCompetencies() {
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
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            columnGap: 'var(--space-7)',
          }}
        >
          {COMPETENCIES.map((label, i) => (
            <li
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                paddingBlock: 'var(--space-5)',
              }}
            >
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="type-h1" style={{ color: 'var(--color-text)' }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
