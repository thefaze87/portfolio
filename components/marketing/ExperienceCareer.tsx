import { SectionLabel } from '@/components/brand/SectionLabel';
import careerData from '@/content/experience/career.json';

/**
 * ExperienceCareer — EXP.01. Portfolio-style case studies, one per role. Each
 * entry renders: dates + org + role header (left), then a summary paragraph,
 * a KEY OUTCOMES list, and a TECH stack chip row (right). The first entry
 * is the current role and carries the orange active accent.
 *
 * Roles with empty `outcomes` / `tech` arrays show only the summary —
 * compact treatment for shorter chapters in the timeline without dropping
 * them entirely. Add `href` to any entry to render an optional Case Study
 * link (omitted everywhere right now; the schema accepts it for later).
 *
 * Server Component. Each org is an h3 (page order h1 → h2 → h3).
 */

interface CareerEntry {
  org: string;
  role: string;
  dates: string;
  summary: string;
  outcomes: string[];
  tech: string[];
  themes?: string[];
  href?: string;
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

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '24ch' }}>
          The career, as case studies.
        </h2>

        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-9)',
          }}
        >
          {CAREER.map((entry, i) => {
            const active = i === 0;
            const hasOutcomes = entry.outcomes.length > 0;
            const hasTech = entry.tech.length > 0;
            return (
              <li
                key={entry.org}
                style={{
                  paddingTop: 'var(--space-7)',
                  borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                }}
              >
                <article
                  className="grid grid-cols-1 lg:grid-cols-12"
                  style={{ gap: 'var(--space-7)' }}
                >
                  {/* Header column — dates / org / role */}
                  <header
                    className="lg:col-span-4"
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <span
                      className="type-mono-label nums-tabular"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {entry.dates}
                    </span>
                    <h3
                      className="type-h1"
                      style={{ marginTop: 'var(--space-4)', maxWidth: '20ch' }}
                    >
                      {entry.org}
                    </h3>
                    <p
                      className="type-body"
                      style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}
                    >
                      {entry.role}
                    </p>
                  </header>

                  {/* Body column — summary, outcomes, tech */}
                  <div
                    className="lg:col-span-8"
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
                  >
                    <p
                      className="type-body-lg"
                      style={{ color: 'var(--color-text)', maxWidth: '64ch' }}
                    >
                      {entry.summary}
                    </p>

                    {hasOutcomes && (
                      <div>
                        <span
                          className="type-mono-label"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Key outcomes
                        </span>
                        <ul
                          style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            marginTop: 'var(--space-4)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)',
                            maxWidth: '64ch',
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

                    {hasTech && (
                      <div>
                        <span
                          className="type-mono-label"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Technologies
                        </span>
                        <ul
                          className="flex flex-wrap"
                          style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            marginTop: 'var(--space-4)',
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

                    {entry.themes && entry.themes.length > 0 && (
                      <div>
                        <span
                          className="type-mono-label"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Architectural themes
                        </span>
                        <p
                          className="type-mono-label"
                          style={{
                            marginTop: 'var(--space-3)',
                            color: 'var(--color-accent)',
                          }}
                        >
                          {entry.themes.join(' · ')}
                        </p>
                      </div>
                    )}

                    {entry.href && (
                      <a
                        href={entry.href}
                        className="cta-text type-body inline-flex"
                        style={{ marginTop: 'var(--space-2)' }}
                      >
                        Read the case study →
                      </a>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
