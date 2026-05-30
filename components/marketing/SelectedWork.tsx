import { SectionLabel } from '@/components/brand/SectionLabel';
import workData from '@/content/experience/work.json';

/**
 * SelectedWork — WORK.01. Portfolio-style case study cards rendered from
 * content/experience/work.json. Each card carries: tag (mono kicker),
 * title (h3), short description, key outcomes, tech chips, and an
 * optional href that becomes a "Read the case study →" link only when
 * present.
 *
 * Two-column grid on desktop (→ 1 mobile). Cards are bordered, flat,
 * no shadows — same visual vocabulary as the career case studies but
 * tighter (description + 2-3 outcome bullets rather than the full
 * "this is a chapter of my career" treatment).
 *
 * Server Component. Add or remove entries by editing work.json — no
 * code changes needed unless the card schema itself changes.
 */

interface WorkEntry {
  title: string;
  subtitle: string;
  description: string;
  outcomes: string[];
  tech: string[];
  tag?: string;
  href?: string;
}

const WORK = workData as WorkEntry[];

export function SelectedWork() {
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
        <SectionLabel>WORK.01</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '24ch' }}>
          Selected work.
        </h2>

        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-5)',
            color: 'var(--color-text-muted)',
            maxWidth: '60ch',
          }}
        >
          Recent case studies — the work behind the timeline.
        </p>

        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
        >
          {WORK.map((entry) => (
            <article
              key={entry.title}
              className="flex flex-col"
              style={{
                padding: 'var(--space-7)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                gap: 'var(--space-5)',
                height: '100%',
              }}
            >
              {entry.tag && (
                <span className="type-mono-label" style={{ color: 'var(--color-accent)' }}>
                  {entry.tag}
                </span>
              )}

              <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <h3 className="type-h2">{entry.title}</h3>
                <p className="type-body" style={{ color: 'var(--color-text-muted)' }}>
                  {entry.subtitle}
                </p>
              </header>

              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                {entry.description}
              </p>

              {entry.outcomes.length > 0 && (
                <div>
                  <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
                    Outcomes
                  </span>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      marginTop: 'var(--space-3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {entry.outcomes.map((outcome) => (
                      <li
                        key={outcome}
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
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.tech.length > 0 && (
                <div>
                  <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
                    Stack
                  </span>
                  <ul
                    className="flex flex-wrap"
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      marginTop: 'var(--space-3)',
                      gap: 'var(--space-2) var(--space-3)',
                    }}
                  >
                    {entry.tech.map((t) => (
                      <li
                        key={t}
                        className="type-mono-body"
                        style={{
                          color: 'var(--color-text)',
                          paddingBlock: 'var(--space-1)',
                          paddingInline: 'var(--space-3)',
                          border: 'var(--stroke-hairline) solid var(--color-border-strong)',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.href && (
                <a href={entry.href} className="cta-text type-body inline-flex">
                  Read the case study →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
