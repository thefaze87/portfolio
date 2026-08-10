import { cn } from '@/lib/utils';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import timelineData from '@/content/experience/timeline.json';

/**
 * ExperienceProgression — EXP.01. The career as a visual arc rather than a list.
 *
 * The point of this section is not "here are the jobs" — ExperienceCareer below
 * already does that in depth. The point is the *shape* of the twenty years:
 * developer → senior engineer → product/UX-minded engineer → solutions
 * architect. A recruiter scanning for thirty seconds should be able to read
 * that trajectory off the page without reading a single role description.
 *
 * So each entry carries a `stage` — the phase of the arc it belongs to — and
 * the stage legend above the rail makes the progression explicit. Stage
 * transitions are marked on the rail itself.
 *
 * Layout reuses the .exp-* rail classes in globals.css (shared with the
 * homepage timeline): a left rail on mobile, a centered rail with alternating
 * entries at ≥1024px. Text stays left-aligned in both.
 *
 * Server Component. Hover/focus affordances are CSS-only — the entries are
 * informational, and making them interactive would promise a detail page that
 * does not exist per role.
 */

interface TimelineEntry {
  org: string;
  role: string;
  dates: string;
}

interface TimelineData {
  roles: TimelineEntry[];
  parallel: TimelineEntry;
}

const { roles: ROLES, parallel: PARALLEL } = timelineData as TimelineData;

/**
 * The four phases of the arc, oldest to newest. `orgs` maps each role onto a
 * phase — keyed by org so reordering the timeline data can't silently
 * mis-assign a stage.
 */
const STAGES = [
  {
    id: 'craft',
    label: 'Craft',
    caption: 'Senior Developer → Creative Director',
    orgs: ['LawLytics'],
  },
  {
    id: 'scale',
    label: 'Scale',
    caption: 'Engineering in regulated and high-volume environments',
    orgs: ["Johns Hopkins All Children's Hospital", 'Ramsey Solutions', 'Publix Super Markets'],
  },
  {
    id: 'systems',
    label: 'Systems',
    caption: 'Frontend architecture and design systems at organizational scale',
    orgs: ['Scorpion'],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    caption: 'Integration, platform, and AI strategy across teams',
    orgs: ['Roghnu', 'Life Surge'],
  },
] as const;

type StageId = (typeof STAGES)[number]['id'];

/**
 * Resolve an org to its stage.
 *
 * Matched on the exact org string from timeline.json — note the apostrophe in
 * "Johns Hopkins All Children's Hospital" must be a real character here, not
 * an HTML entity, or the match silently fails and the role is mis-staged.
 *
 * An unmatched org falls back to the newest stage rather than rendering
 * unlabelled: a slightly wrong label is easier to spot in review than a
 * missing one.
 */
function stageFor(org: string): StageId {
  return STAGES.find((s) => (s.orgs as readonly string[]).includes(org))?.id ?? 'architecture';
}

const STAGE_LABEL: Record<StageId, string> = Object.fromEntries(
  STAGES.map((s) => [s.id, s.label]),
) as Record<StageId, string>;

export function ExperienceProgression() {
  return (
    <Section labelledBy="experience-progression">
      <SectionHeader
        id="experience-progression"
        label="EXP.01"
        title="Twenty years, in four movements."
        titleMaxCh={22}
        leadMaxCh={64}
        lead="Not a résumé — a trajectory. Each phase changed what kind of problem I was trusted with, and the current work only makes sense as the sum of the ones before it."
      />

      {/* Stage legend. The arc, stated plainly before the rail renders it. */}
      <ol
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          marginTop: 'var(--space-8)',
          gap: 'var(--space-5)',
        }}
      >
        {STAGES.map((stage, i) => (
          <li
            key={stage.id}
            style={{
              borderTop: `var(--stroke-thin) solid ${
                i === STAGES.length - 1 ? 'var(--color-accent)' : 'var(--color-border-strong)'
              }`,
              paddingTop: 'var(--space-4)',
            }}
          >
            <span
              className="type-mono-label nums-tabular"
              style={{ color: 'var(--color-text-dim)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3
              className="type-h3"
              style={{
                marginTop: 'var(--space-2)',
                color: i === STAGES.length - 1 ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {stage.label}
            </h3>
            <p
              className="type-body-sm"
              style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}
            >
              {stage.caption}
            </p>
          </li>
        ))}
      </ol>

      {/* The rail. Newest first, matching every other listing on the site. */}
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

        {ROLES.map((entry, i) => {
          const current = i === 0;
          const side = i % 2 === 0 ? 'left' : 'right';
          const stage = stageFor(entry.org);

          return (
            <li key={entry.org} className={cn('exp-entry', `exp-entry--${side}`)}>
              <span className="exp-node">
                <span
                  aria-hidden="true"
                  style={{
                    width: 'var(--space-3)',
                    height: 'var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    background: current ? 'var(--color-accent)' : 'var(--color-bg)',
                    border: current
                      ? 'none'
                      : 'var(--stroke-thin) solid var(--color-border-strong)',
                  }}
                />
              </span>

              <div className="exp-content">
                <div
                  className="flex flex-wrap items-center"
                  style={{ gap: 'var(--space-2) var(--space-4)' }}
                >
                  <span
                    className="type-mono-label nums-tabular"
                    style={{ color: current ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                  >
                    {entry.dates}
                  </span>
                  <span
                    className="type-mono-label"
                    style={{
                      color: 'var(--color-text-dim)',
                      paddingBlock: '2px',
                      paddingInline: 'var(--space-2)',
                      border: 'var(--stroke-hairline) solid var(--color-border)',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {STAGE_LABEL[stage]}
                  </span>
                </div>

                <h3 className="type-h3" style={{ marginTop: 'var(--space-3)' }}>
                  {entry.org}
                </h3>
                <p
                  className="type-body"
                  style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-muted)' }}
                >
                  {entry.role}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Parallel practice — outside the ordered list because it spans the whole
       * arc rather than occupying a position in it. */}
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
          style={{
            marginTop: 'var(--space-1)',
            color: 'var(--color-text-muted)',
            maxWidth: '60ch',
          }}
        >
          {PARALLEL.role} — running continuously alongside every role above. Twenty years of walking
          into systems I did not build and being asked what to do about them.
        </p>
      </div>
    </Section>
  );
}
