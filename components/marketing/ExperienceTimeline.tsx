import { cn } from '@/lib/utils';
import { SectionLabel } from '@/components/brand/SectionLabel';
import timelineData from '@/content/experience/timeline.json';

/**
 * ExperienceTimeline — EXP.01. A visual narrative of how experience compounds
 * into judgment (not a résumé): an editorial vertical timeline with a thin
 * connector rail and one subtle orange "active" node (the current role).
 *
 * Layout (CSS in globals.css, .exp-* classes): mobile is a single column on a
 * left rail; desktop alternates entries left/right of a centered rail. Text
 * stays left-aligned throughout — only the block's side alternates — so there
 * are no awkward right-aligned paragraphs.
 *
 * Server Component. The timeline is an ordered list; each entry's org is an
 * h3, keeping page heading order h1 → h2 (section) → h3 (entry).
 */

interface TimelineEntry {
  org: string;
  role: string;
  dates?: string;
  /** Optional — kept editorial; entries currently render org/role/dates only. */
  highlights?: string[];
}

const TIMELINE = timelineData as TimelineEntry[];

export function ExperienceTimeline() {
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
        <SectionLabel>EXP.01</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          20+ years designing systems, teams, and platforms.
        </h2>

        <div style={{ marginTop: 'var(--space-6)', maxWidth: '60ch' }}>
          <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
            From enterprise healthcare and ecommerce to architecture leadership, AI initiatives, and
            large-scale business systems.
          </p>
          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
          >
            My work has focused on helping organizations make better technical decisions and build
            systems that endure.
          </p>
        </div>

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
          <span aria-hidden="true" className="exp-line" />

          {TIMELINE.map((entry, i) => {
            const active = i === 0;
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <li key={entry.org} className={cn('exp-entry', `exp-entry--${side}`)}>
                <span className="exp-node">
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

                <div className="exp-content">
                  {entry.dates && (
                    <span
                      className="type-mono-label nums-tabular"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {entry.dates}
                    </span>
                  )}
                  <h3 className="type-h3" style={{ marginTop: entry.dates ? 'var(--space-3)' : 0 }}>
                    {entry.org}
                  </h3>
                  <p
                    className="type-body"
                    style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-muted)' }}
                  >
                    {entry.role}
                  </p>

                  {entry.highlights && entry.highlights.length > 0 && (
                    <ul
                      className="flex flex-wrap"
                      style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        marginTop: 'var(--space-4)',
                        gap: '0 var(--space-3)',
                      }}
                    >
                      {entry.highlights.map((highlight, h) => (
                        <li
                          key={highlight}
                          className="type-body-sm"
                          style={{
                            color: 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                          }}
                        >
                          {h > 0 && (
                            <span aria-hidden="true" style={{ color: 'var(--color-text-muted)' }}>
                              ·
                            </span>
                          )}
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
