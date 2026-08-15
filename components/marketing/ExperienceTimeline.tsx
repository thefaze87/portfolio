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
  /** Verified outcomes for the role, rendered as a dot-separated row. Keep to
   *  two or three: this is the homepage, and the entry is a headline, not the
   *  case study. Every value must trace to content/experience/career.json. */
  highlights?: string[];
}

/**
 * The data separates employment (`roles`, strictly reverse-chronological) from
 * the parallel consulting practice. Mark Fasel, LLC spans 2014–Present and
 * overlaps every role from Scorpion onward, so placing it in the sequence
 * necessarily broke chronology wherever it landed. It renders as a coda below
 * the rail instead.
 */
interface TimelineData {
  roles: TimelineEntry[];
  parallel: TimelineEntry;
}

const { roles: TIMELINE, parallel: PARALLEL } = timelineData as TimelineData;

export function ExperienceTimeline() {
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
          20+ years designing systems, teams, and platforms.
        </h2>

        <div style={{ marginTop: 'var(--space-6)', maxWidth: '60ch' }}>
          <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
            From enterprise healthcare and ecommerce to architecture leadership, AI initiatives, and
            large-scale business systems.
          </p>
          {/* Was: "helping organizations make better technical decisions and
           * build systems that endure" — the same claim the hero made two
           * sections earlier, in almost the same words. Replaced with what
           * the timeline entries below now actually evidence. */}
          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
          >
            The pattern across all of it: faster delivery, fewer defects, and systems the next team
            can still change.
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
            // Bound to a local so the `.length > 0` guard below narrows inside
            // the map callback — TypeScript drops narrowing on a property
            // access once it crosses a function boundary.
            const highlights = entry.highlights ?? [];
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

                  {highlights.length > 0 && (
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
                      {/* The separator TRAILS each item rather than leading
                       * the next one. This list had never been given data, so
                       * the flaw was invisible: with the dot rendered before
                       * the item, any wrap put a "·" at the start of the new
                       * line. Trailing it means the dot always rides at the
                       * end of a line and never opens one — the same rule
                       * RoleLine enforces for the footer role line.
                       *
                       * The item text is deliberately left wrappable; only
                       * the separator is pinned to its item, so a long
                       * outcome can still break internally on a phone. */}
                      {highlights.map((highlight, h) => (
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
                          {highlight}
                          {h < highlights.length - 1 && (
                            <span aria-hidden="true" style={{ color: 'var(--color-text-dim)' }}>
                              ·
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Parallel practice — deliberately outside the <ol>. It isn't a step
         * in the sequence; it runs underneath all of them. */}
        <div
          style={{
            marginTop: 'var(--space-9)',
            paddingTop: 'var(--space-7)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <span className="type-mono-label nums-tabular" style={{ color: 'var(--color-accent)' }}>
            Parallel practice · {PARALLEL.dates}
          </span>
          <h3 className="type-h3" style={{ marginTop: 'var(--space-3)' }}>
            {PARALLEL.org}
          </h3>
          <p
            className="type-body"
            style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-muted)' }}
          >
            {PARALLEL.role} — running alongside every role above.
          </p>
        </div>
      </div>
    </section>
  );
}
