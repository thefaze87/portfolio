import Link from 'next/link';
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

/**
 * Three routes into the site, for a reader who wants evidence before contact.
 *
 * `kicker` names the destination; the heading stays the editorial label. All
 * three cards previously carried the same word — "Explore" — which told a
 * reader nothing and made the row read as one repeated control rather than
 * three distinct destinations.
 *
 * "The work" also described the wrong thing: it advertised commerce and
 * location-based experiences, which moved to /products when the ownership
 * line was drawn, while linking to /projects. Its body now describes the
 * client engagements actually on that page, led by what they produced.
 */
const PATHS = [
  {
    kicker: 'Projects',
    label: 'The work',
    href: '/projects',
    body: 'Client platforms end to end — ERP import rebuilt as a product, a design system two frameworks share, and financial systems taught to agree.',
  },
  {
    kicker: 'Experience',
    label: 'The record',
    href: '/experience',
    body: 'Twenty years across healthcare, retail, media, and enterprise platforms — role by role, with the outcomes attached.',
  },
  {
    kicker: 'Writing',
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
        lead={
          <>
            <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
              If something here matches what you&apos;re dealing with, describe it and the outcome
              you need. If I&apos;m not the right person, I&apos;ll say so and point you somewhere
              better.
            </p>
            {/* The homepage's only route to /consulting. It was reachable
             * from the nav and nowhere else on this page, so a founder or CTO
             * reading top to bottom never saw how engagements actually work —
             * the one thing a buyer wants before sending a message. */}
            <p
              className="type-body-lg"
              style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
            >
              If you&apos;d rather see how engagements are structured first, that is on{' '}
              <Link href="/consulting" className="prose-link">
                Consulting
              </Link>
              .
            </p>
          </>
        }
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
            <SectionLabel>{path.kicker}</SectionLabel>
            {/* next/link, not a bare <a>. These are internal routes, and a
             * raw anchor forced a full document request — no client-side
             * navigation and no prefetch — on the three cards that are the
             * homepage's main path deeper into the site. */}
            <h3 className="type-h3 card-title" style={{ marginTop: 'var(--space-4)' }}>
              <Link href={path.href} style={{ color: 'inherit' }}>
                {path.label}
              </Link>
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
