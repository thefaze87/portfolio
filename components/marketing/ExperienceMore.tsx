import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { LINKEDIN_HREF, RESUME } from '@/lib/nav';

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
 * ## This is the homepage's recruiter surface
 *
 * The body used to re-list the industries EXP.02 had just set in 40px type,
 * one section earlier — the clearest duplication on the page. It now does a
 * job no other homepage section does: hand over the three artifacts a hiring
 * conversation actually needs.
 *
 * The résumé was previously reachable only from /experience, two clicks deep.
 * A recruiter who lands on the homepage with sixty seconds could not download
 * it without first knowing to go looking, which is the single highest-value
 * conversion gap the homepage had.
 *
 * The résumé link is a plain <a download>, not <Button href>: Button renders
 * next/link for internal paths, and Link would prefetch a 73KB PDF for every
 * visitor who scrolls this far. Same reasoning as ExperienceLinks (EXP.05).
 * It is gated on RESUME.available for the same reason nav links are gated on
 * `published` — never render a link to a file that isn't there.
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
            The complete record.
          </h2>

          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-5)', color: 'var(--color-text-muted)' }}
          >
            Role by role: scope, outcomes, and the stack behind each one. The two-page résumé and
            the full LinkedIn profile are here too.
          </p>

          <div
            className="flex flex-wrap"
            style={{ marginTop: 'var(--space-6)', gap: 'var(--space-5)' }}
          >
            <Button href="/experience" variant="text">
              View the full experience →
            </Button>
            {RESUME.available && (
              <a
                href={RESUME.href}
                download
                className="cta-text type-body inline-flex items-center"
              >
                Download résumé (PDF) →
              </a>
            )}
            <Button href={LINKEDIN_HREF} variant="text">
              LinkedIn →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
