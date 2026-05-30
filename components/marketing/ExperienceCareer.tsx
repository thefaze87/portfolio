import { SectionLabel } from '@/components/brand/SectionLabel';
import careerData from '@/content/experience/career.json';

/**
 * ExperienceCareer — EXP.01. The full career record. Where the homepage
 * timeline (ExperienceTimeline) is a decorative alternating coda, this is the
 * detailed version: a single left-rail column with room for 2–4 impact
 * bullets per role.
 *
 * The rail stays on the left at every breakpoint (no desktop alternation) so
 * bullet lists have full reading width. One orange node marks the current
 * role (top entry); the rest are hollow ring nodes. Reads top-down by recency.
 *
 * Server Component. Each org is an h3 (page order h1 → h2 → h3). Content
 * lives in content/experience/career.json.
 *
 * NOTE: the per-role highlight bullets are placeholder copy — descriptive of
 * each role, with no invented metrics. Replace with real résumé bullets.
 */

interface CareerEntry {
  org: string;
  role: string;
  dates: string;
  highlights: string[];
}

const CAREER = careerData as CareerEntry[];

export function ExperienceCareer() {
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
        <SectionLabel>EXP.01</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          The career, in full.
        </h2>

        <ol
          className="relative"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {/* Continuous rail behind the node column. aria-hidden — purely
           * decorative; the ordered list already conveys sequence. */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 'calc(var(--space-7) / 2)',
              width: 'var(--stroke-thin)',
              background: 'var(--color-border)',
              transform: 'translateX(-50%)',
            }}
          />

          {CAREER.map((entry, i) => {
            const active = i === 0;
            return (
              <li
                key={entry.org}
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: 'var(--space-7) 1fr',
                  alignItems: 'start',
                }}
              >
                <span
                  style={{
                    gridColumn: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: 'var(--space-2)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 'var(--space-3)',
                      height: 'var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      background: active ? 'var(--color-accent)' : 'var(--color-bg)',
                      border: active
                        ? 'none'
                        : 'var(--stroke-thin) solid var(--color-border-strong)',
                    }}
                  />
                </span>

                <div style={{ gridColumn: 2, maxWidth: '60ch' }}>
                  <span
                    className="type-mono-label nums-tabular"
                    style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                  >
                    {entry.dates}
                  </span>
                  <h3 className="type-h2" style={{ marginTop: 'var(--space-3)' }}>
                    {entry.org}
                  </h3>
                  <p
                    className="type-body"
                    style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-muted)' }}
                  >
                    {entry.role}
                  </p>

                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      marginTop: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {entry.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="type-body"
                        style={{
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          gap: 'var(--space-3)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{ color: 'var(--color-text-dim)', flexShrink: 0 }}
                        >
                          —
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
