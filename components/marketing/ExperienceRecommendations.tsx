import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * ExperienceRecommendations — EXP.04. The architecture-ready layout that will
 * hold real LinkedIn recommendations: bordered, flat quote cards (2 → 1)
 * built on semantic <figure>/<blockquote>/<figcaption>. No avatars, no
 * platform branding, no carousel — editorial, like a foreword.
 *
 * The quotes below are PLACEHOLDER copy (marked with a muted "Placeholder"
 * tag). Replace `RECOMMENDATIONS` with real endorsements and delete the tag.
 *
 * Server Component.
 */

const RECOMMENDATIONS: readonly { quote: string; name: string; title: string }[] = [
  {
    quote:
      'Placeholder recommendation. This is where a real endorsement will sit — a few sentences on how Mark approached a hard problem and the outcome it produced.',
    name: 'First Last',
    title: 'Title · Company',
  },
  {
    quote:
      'Placeholder recommendation. A second voice, ideally from a different vantage point — a peer, a report, or a stakeholder — speaking to judgment and impact.',
    name: 'First Last',
    title: 'Title · Company',
  },
];

export function ExperienceRecommendations() {
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
        <SectionLabel>EXP.04</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          What others say.
        </h2>

        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
        >
          {RECOMMENDATIONS.map((rec, i) => (
            <figure
              key={i}
              className="flex flex-col"
              style={{
                margin: 0,
                padding: 'var(--space-7)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                height: '100%',
              }}
            >
              <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
                Placeholder
              </span>

              <blockquote
                className="type-body-lg"
                style={{ margin: 0, marginTop: 'var(--space-5)', color: 'var(--color-text)' }}
              >
                {rec.quote}
              </blockquote>

              <figcaption
                style={{
                  marginTop: 'var(--space-6)',
                  paddingTop: 'var(--space-5)',
                  borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                }}
              >
                <span
                  className="type-body"
                  style={{ color: 'var(--color-text)', display: 'block' }}
                >
                  {rec.name}
                </span>
                <span
                  className="type-mono-label"
                  style={{
                    color: 'var(--color-text-muted)',
                    display: 'block',
                    marginTop: 'var(--space-2)',
                  }}
                >
                  {rec.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
