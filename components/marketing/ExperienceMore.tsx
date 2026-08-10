import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { LINKEDIN_HREF } from '@/lib/nav';

/**
 * ExperienceMore — EXP.03. A quiet editorial coda to the experience block:
 * the timeline shows the chapters; this points to the fuller record. No card,
 * no background, no icon — just label, statement, muted body, and text CTAs
 * (white → accent on hover, not orange buttons).
 *
 * /experience leads and LinkedIn follows. Previously the only action here was
 * the outbound LinkedIn link, which made an off-site link the last thing a
 * visitor could do on the homepage. The on-site record comes first now.
 *
 * Server Component. Content block capped at 640px for editorial line length.
 */

export function ExperienceMore() {
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

          <div
            className="flex flex-wrap"
            style={{ marginTop: 'var(--space-6)', gap: 'var(--space-5)' }}
          >
            <Button href="/experience" variant="text">
              View the full experience →
            </Button>
            <Button href={LINKEDIN_HREF} variant="text">
              LinkedIn →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
