import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * LegalDocument — the shared shell for /privacy and /terms.
 *
 * ## Why these pages get a component rather than hand-written markup
 *
 * Legal pages are the ones nobody revisits, which is exactly why they drift:
 * one gets an `<h2>` and the other an `<h3>`, one caps its measure and the
 * other runs to 1280px. Both documents render through this, so they cannot
 * disagree about type scale, measure, or heading order.
 *
 * ## Design position
 *
 * This deliberately looks like the rest of the site and nothing like a legal
 * template — no card wrappers, no bordered callout boxes, no legal-tech
 * chrome. It is the same numbered-row editorial treatment the career record
 * and the engagement model use, at a prose measure of 68ch.
 *
 * The numbers are `aria-hidden`: they are a visual index, and the headings
 * already carry the structure a screen reader navigates by. Reading "zero one
 * Information you provide" would add noise, not orientation.
 *
 * Server Component.
 */

export interface LegalSection {
  /** Stable anchor id, so a clause can be linked to directly. */
  id: string;
  heading: string;
  body: React.ReactNode;
}

/** Body paragraph. Exported so page files stay readable prose, not markup. */
export function LegalP({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-body-lg" style={{ color: 'var(--color-text-muted)', maxWidth: '68ch' }}>
      {children}
    </p>
  );
}

/** Bulleted list, styled to match the site's em-dash list treatment. */
export function LegalList({ items }: { items: readonly React.ReactNode[] }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        maxWidth: '68ch',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="type-body-lg"
          style={{ color: 'var(--color-text-muted)', display: 'flex', gap: 'var(--space-3)' }}
        >
          <span aria-hidden="true" style={{ color: 'var(--color-text-dim)', flexShrink: 0 }}>
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalDocument({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <div
      style={{
        marginTop: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="grid grid-cols-1 lg:grid-cols-[4rem_1fr]"
          style={{
            gap: 'var(--space-4) var(--space-6)',
            paddingBlock: 'var(--space-7)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <span
            aria-hidden="true"
            className="type-mono-label nums-tabular"
            style={{ color: 'var(--color-text-dim)', paddingTop: 'var(--space-2)' }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>

          <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
            <h2 id={`${section.id}-heading`} className="type-h2" style={{ maxWidth: '30ch' }}>
              {section.heading}
            </h2>
            {section.body}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * The effective-date line that opens both documents.
 *
 * Stated as a month rather than a precise date: these are reviewed when the
 * tooling changes, not on a schedule, and a day-precise date implies a
 * revision discipline that does not exist. Claiming less is the honest option.
 */
export function LegalEffectiveDate({ date }: { date: string }) {
  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <SectionLabel>Last updated</SectionLabel>
      <p className="type-body" style={{ marginTop: 'var(--space-3)', color: 'var(--color-text)' }}>
        {date}
      </p>
    </div>
  );
}
