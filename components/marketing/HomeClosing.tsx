import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NEWSLETTER } from '@/lib/nav';

/**
 * HomeClosing — the homepage's conversion section.
 *
 * Before this existed the homepage ended on an outbound LinkedIn link, which
 * made "leave for another company's site" the last available action on the
 * highest-traffic page. Two paths now close it:
 *
 *   1. Start a conversation (the buyer path, and the page's single orange CTA)
 *   2. Subscribe to the newsletter (the compounding path — a visitor who is not
 *      ready to talk is otherwise a one-time visitor)
 *
 * The newsletter link goes to Substack rather than a native capture form. That
 * is a deliberate launch-scope decision, not an oversight: owning the list means
 * a form, a store, and double opt-in, and Substack is a working answer today.
 *
 * Server Component.
 */

/** Three routes into the site, for a reader who wants evidence before contact. */
const PATHS = [
  {
    label: 'The work',
    href: '/projects',
    body: 'Platforms architected end to end — commerce, location-based experiences, and enterprise data tooling.',
  },
  {
    label: 'The record',
    href: '/experience',
    body: 'Twenty years across healthcare, retail, media, and enterprise platforms, role by role.',
  },
  {
    label: 'The thinking',
    href: '/writing',
    body: 'Essays on architecture, AI, and the systems thinking underneath both.',
  },
] as const;

export function HomeClosing() {
  return (
    <Section labelledBy="home-closing">
      <SectionHeader
        id="home-closing"
        label="EXP.04"
        title="Start with the problem."
        titleMaxCh={20}
        leadMaxCh={56}
        lead="If something here matches what you're dealing with, describe it and the outcome you need. If I'm not the right person, I'll say so and point you somewhere better."
      />

      <div
        className="flex flex-wrap"
        style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
      >
        <Button href="/contact" variant="primary">
          Let&apos;s Talk →
        </Button>
        <Button href={NEWSLETTER.href} variant="ghost">
          Subscribe to {NEWSLETTER.name}
        </Button>
      </div>

      {/* Not ready to talk? Three ways further in, rather than a dead end. */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
      >
        {PATHS.map((path) => (
          <Card key={path.href} interactive>
            <SectionLabel>Explore</SectionLabel>
            <h3 className="type-h3 card-title" style={{ marginTop: 'var(--space-4)' }}>
              <a href={path.href} style={{ color: 'inherit' }}>
                {path.label}
              </a>
            </h3>
            <p
              className="type-body"
              style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
            >
              {path.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
