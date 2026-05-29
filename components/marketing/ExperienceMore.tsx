import { SectionLabel } from '@/components/brand/SectionLabel';
import { PLATFORMS } from '@/lib/nav';

/**
 * ExperienceMore — EXP.03. A quiet editorial coda to the experience block:
 * the timeline shows the chapters; this points to the fuller record. No card,
 * no background, no icon — just label, statement, muted body, and a text CTA
 * (white → accent on hover, not an orange button). Links out to LinkedIn in a
 * new tab without any LinkedIn branding.
 *
 * Server Component. Content block capped at 640px for editorial line length.
 */

const FULL_EXPERIENCE_HREF =
  PLATFORMS.find((p) => p.label === 'LinkedIn')?.href ?? 'https://linkedin.com/in/markfasel';

export function ExperienceMore() {
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
        <div style={{ maxWidth: '640px' }}>
          <SectionLabel>EXP.03</SectionLabel>

          <h2 className="type-h2" style={{ marginTop: 'var(--space-5)' }}>
            The timeline highlights key chapters.
          </h2>

          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-5)', color: 'var(--color-text-muted)' }}
          >
            My full experience spans healthcare, ecommerce, education, SaaS, enterprise platforms,
            financial integrations, frontend architecture, and AI strategy.
          </p>

          <a
            href={FULL_EXPERIENCE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-text type-body inline-flex"
            style={{ marginTop: 'var(--space-6)' }}
          >
            View Full Experience →<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
