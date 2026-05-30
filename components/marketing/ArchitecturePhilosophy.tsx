import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * ArchitecturePhilosophy — the "architecture is decision-making" section.
 *
 * Sits below the trust bar: section label (ARCH.01), a two-line headline with
 * the takeaway in orange, two lead lines, and a four-card principle grid
 * (4 → 2 → 1 columns). Cards are bordered and flat — no shadows, no glow,
 * sharp radii. The cards are informational, not links, so they carry no
 * hover/interactive affordance.
 *
 * Server Component. The <section> is unlabelled (sectioning, not a landmark);
 * the h2 keeps the page heading order h1 → h2 → h3.
 */

const PRINCIPLES = [
  { n: '01', title: 'Systems Over Tools', body: 'Frameworks change. Principles last.' },
  { n: '02', title: 'Business Before Code', body: 'Technology exists to create outcomes.' },
  {
    n: '03',
    title: 'AI With Intent',
    body: 'AI should improve decisions, not replace thinking.',
  },
  {
    n: '04',
    title: 'Alignment Creates Scale',
    body: 'Most scaling problems begin as communication problems.',
  },
] as const;

export function ArchitecturePhilosophy() {
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
        <SectionLabel>ARCH.01</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '22ch' }}>
          Architecture is not technology.
          <br />
          It&apos;s <span style={{ color: 'var(--color-accent)' }}>decision-making</span>.
        </h2>

        <div style={{ marginTop: 'var(--space-6)', maxWidth: '58ch' }}>
          <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
            The best systems are not the ones that scale the most.
          </p>
          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
          >
            They&apos;re the ones that can adapt, evolve, and create clarity.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
        >
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.n}
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
                {principle.n}
              </span>
              <h3 className="type-h3" style={{ marginTop: 'var(--space-5)' }}>
                {principle.title}
              </h3>
              <p
                className="type-body"
                style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
              >
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
