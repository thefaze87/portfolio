import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { buildMetadata } from '@/lib/seo';
import { contactPageSchema, jsonLd } from '@/lib/schema';
import { PLATFORMS } from '@/lib/nav';
import { PROJECT_INQUIRY } from '@/lib/email';
import { ContactForm } from './_components/ContactForm';

export const metadata: Metadata = buildMetadata({
  title: "Let's Talk",
  description:
    'Start a conversation about architecture, AI strategy, automation, or fractional technical leadership. Tell me what you are working on and the outcome you need.',
  path: '/contact',
});

/**
 * Contact — the site's conversion page. Canonical route is /contact; the UI
 * label everywhere is "Let's Talk".
 *
 * Server Component. The only client island is <ContactForm>, scoped to the
 * form itself so the page's copy, headings, and channel list stay server-
 * rendered and cost no JS.
 *
 * Layout: copy + direct channels on the left, form on the right at desktop;
 * stacked on mobile with the copy first — a visitor should understand what
 * happens after they submit before they start typing.
 */

/** What to expect — set expectations before the form, not after. */
const EXPECTATIONS: readonly string[] = [
  'I read and reply to every message personally.',
  'You will hear back within two business days.',
  'If it is not a fit, I will say so and point you somewhere better.',
];

const DIRECT_CHANNELS = PLATFORMS.filter((p) => p.label === 'LinkedIn' || p.label === 'GitHub');

export default function ContactPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // Static, build-time JSON. No user input reaches this string.
        dangerouslySetInnerHTML={{ __html: jsonLd(contactPageSchema()) }}
      />
      <Section divider={false} labelledBy="contact-heading">
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]"
          style={{ gap: 'var(--space-9)' }}
        >
          {/* Copy column */}
          <div>
            <SectionHeader
              id="contact-heading"
              label="CONTACT"
              as="h1"
              size="display-lg"
              title="Let's talk."
              titleMaxCh={16}
              leadMaxCh={46}
              lead={
                <>
                  <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                    Whether you are scaling a platform, deciding where AI actually belongs, or
                    trying to remove work that should not exist — tell me the problem and the
                    outcome you need.
                  </p>
                  <p
                    className="type-body-lg"
                    style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
                  >
                    The more specific you are, the more useful my first reply will be.
                  </p>
                </>
              }
            />

            <div style={{ marginTop: 'var(--space-8)' }}>
              <SectionLabel as="h2">What happens next</SectionLabel>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  maxWidth: '46ch',
                }}
              >
                {EXPECTATIONS.map((item) => (
                  <li
                    key={item}
                    className="type-body"
                    style={{
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ color: 'var(--color-accent)', flexShrink: 0 }}
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary path. Understated by construction — mono label, plain
             * link, no button — so it reduces friction for people who prefer
             * their own mail client without competing with the form. The
             * address is the link text so it stays readable and copyable even
             * where no mail client is configured. */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <SectionLabel as="h2">Prefer email?</SectionLabel>
              <p style={{ marginTop: 'var(--space-4)' }}>
                <a href={PROJECT_INQUIRY.href} className="prose-link type-body-lg">
                  {PROJECT_INQUIRY.address}
                </a>
              </p>
              <p
                className="type-body-sm"
                style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-dim)' }}
              >
                Opens a draft with a few prompts. Delete whatever doesn&apos;t apply.
              </p>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <SectionLabel as="h2">Elsewhere</SectionLabel>
              <ul
                className="flex flex-wrap"
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                  gap: 'var(--space-5)',
                }}
              >
                {DIRECT_CHANNELS.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link type-mono-label"
                    >
                      {channel.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form column. The heading is visually hidden — the h1 and the
           * lead copy already name this region on screen — but it gives
           * screen-reader users a landmark to jump to instead of having to
           * tab through the left column to reach the form. */}
          <div>
            <h2 className="sr-only">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </main>
  );
}
