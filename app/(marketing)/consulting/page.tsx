import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/lib/seo';
import { faqSchema, jsonLd, servicesSchema } from '@/lib/schema';
import { CONSULTING_INQUIRY } from '@/lib/email';
import servicesData from '@/content/consulting/services.json';

export const metadata: Metadata = buildMetadata({
  title: 'Consulting',
  description:
    'Two ways to work together: architecture and AI strategy advisory for organizations with complex systems, and AI automation for growing businesses.',
  path: '/consulting',
});

/**
 * Consulting — the revenue page, and a deliberate two-path entry point.
 *
 * The positioning problem this page solves: a VP Engineering at a $200M company
 * and an owner-led restaurant group are not the same buyer, and a page that
 * tries to speak to both at once convinces neither. So the page leads with the
 * shared outcome ("work that shouldn't exist"), then forks explicitly into two
 * named paths. Each path owns its own language — the advisory path can say
 * "system boundaries", the automation path never has to.
 *
 * Vertical landing pages (/consulting/restaurants, /consulting/trades, …) are
 * deliberately NOT built yet. This page is their eventual hub.
 *
 * Server Component.
 */

interface ServiceItem {
  name: string;
  detail: string;
}
interface Path {
  id: string;
  kicker: string;
  title: string;
  audience: string;
  description: string;
  services: ServiceItem[];
  verticals?: string[];
}
interface ServicesData {
  paths: Path[];
  engagement: { n: string; title: string; body: string; duration: string }[];
  fitFor: string[];
  notFitFor: string[];
  faq: { question: string; answer: string }[];
}

const DATA = servicesData as ServicesData;

export default function ConsultingPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // Static, build-time JSON from lib/schema.ts. No user input reaches this.
        dangerouslySetInnerHTML={{
          // Spread, not nest: servicesSchema returns an array of Service nodes,
          // and a JSON-LD graph must be a flat array of entities.
          __html: jsonLd([...servicesSchema(DATA.paths), faqSchema(DATA.faq)]),
        }}
      />

      {/* CONS.00 — positioning. Leads with the outcome both audiences share, so
       * neither has to self-identify before the page has earned their attention. */}
      <Section divider={false} labelledBy="consulting-heading">
        <SectionHeader
          id="consulting-heading"
          label="CONSULTING"
          as="h1"
          size="display-lg"
          title="Most of the work costing you money shouldn't exist."
          titleMaxCh={26}
          leadMaxCh={62}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                Sometimes it&apos;s a platform that has become expensive to change. Sometimes
                it&apos;s five people retyping the same information into three systems. The symptoms
                look nothing alike. The cause is usually the same: nobody has been paid to think
                about the whole thing at once.
              </p>
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                That&apos;s what I do. Two paths, depending on the shape of your problem.
              </p>
            </>
          }
        />
      </Section>

      {/* CONS.01 / CONS.02 — the two paths. Rendered as sibling sections rather
       * than side-by-side cards so each gets room to speak in its own register. */}
      {DATA.paths.map((path, i) => (
        <Section key={path.id} id={path.id} labelledBy={`${path.id}-heading`}>
          <SectionHeader
            id={`${path.id}-heading`}
            label={`CONS.0${i + 1} · ${path.kicker}`}
            title={path.title}
            titleMaxCh={26}
            leadMaxCh={64}
            lead={
              <>
                <p className="type-body-lg" style={{ color: 'var(--color-accent)' }}>
                  {path.audience}
                </p>
                <p
                  className="type-body-lg"
                  style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
                >
                  {path.description}
                </p>
              </>
            }
          />

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              marginTop: 'var(--space-8)',
              gap: 'var(--space-5)',
            }}
          >
            {path.services.map((service) => (
              <Card as="li" key={service.name}>
                <h3 className="type-h3">{service.name}</h3>
                <p
                  className="type-body"
                  style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
                >
                  {service.detail}
                </p>
              </Card>
            ))}
          </ul>

          {path.verticals && (
            <div style={{ marginTop: 'var(--space-7)' }}>
              <SectionLabel>Businesses I do this for</SectionLabel>
              <ul
                className="flex flex-wrap"
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                  gap: 'var(--space-2) var(--space-3)',
                }}
              >
                {path.verticals.map((v) => (
                  <li
                    key={v}
                    className="type-mono-body"
                    style={{
                      color: 'var(--color-text)',
                      paddingBlock: 'var(--space-1)',
                      paddingInline: 'var(--space-3)',
                      border: 'var(--stroke-hairline) solid var(--color-border-strong)',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      ))}

      {/* CONS.03 — engagement model. Premium consulting sells process legibility:
       * a buyer needs to know what happens next before they'll take the call. */}
      <Section labelledBy="consulting-engagement">
        <SectionHeader
          id="consulting-engagement"
          label="CONS.03"
          title="How engagements work."
          titleMaxCh={22}
          lead="No open-ended hourly arrangements. Every step has a defined end and something you keep."
        />

        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {DATA.engagement.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-1 lg:grid-cols-[4rem_1fr_14rem]"
              style={{
                gap: 'var(--space-3) var(--space-6)',
                paddingBlock: 'var(--space-6)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
              }}
            >
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-accent)', paddingTop: 'var(--space-1)' }}
              >
                {step.n}
              </span>
              <div>
                <h3 className="type-h3">{step.title}</h3>
                <p
                  className="type-body"
                  style={{
                    marginTop: 'var(--space-3)',
                    color: 'var(--color-text-muted)',
                    maxWidth: '60ch',
                  }}
                >
                  {step.body}
                </p>
              </div>
              <span
                className="type-mono-label"
                style={{ color: 'var(--color-text-dim)', paddingTop: 'var(--space-1)' }}
              >
                {step.duration}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* CONS.04 — qualification. Saying who you don't work with is the strongest
       * premium signal available on a consulting page. */}
      <Section labelledBy="consulting-fit">
        <SectionHeader
          id="consulting-fit"
          label="CONS.04"
          title="Whether this is a fit."
          titleMaxCh={22}
          lead="Both lists are honest. The second one has saved us both time more than once."
        />

        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
        >
          <Card padding="lg">
            <SectionLabel as="h3" accent>
              This works when
            </SectionLabel>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                marginTop: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              {DATA.fitFor.map((item) => (
                <li
                  key={item}
                  className="type-body"
                  style={{
                    color: 'var(--color-text)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                  }}
                >
                  <span aria-hidden="true" style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg">
            <SectionLabel as="h3">This doesn&apos;t</SectionLabel>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                marginTop: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              {DATA.notFitFor.map((item) => (
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
                    style={{ color: 'var(--color-text-dim)', flexShrink: 0 }}
                  >
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* CONS.05 — FAQ, carrying FAQPage schema. These are the Tier-2 commercial
       * questions buyers actually search for. */}
      <Section labelledBy="consulting-faq">
        <SectionHeader
          id="consulting-faq"
          label="CONS.05"
          title="Before you ask."
          titleMaxCh={22}
        />

        <dl style={{ margin: 0, marginTop: 'var(--space-8)' }}>
          {DATA.faq.map((item) => (
            <div
              key={item.question}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]"
              style={{
                gap: 'var(--space-4) var(--space-7)',
                paddingBlock: 'var(--space-6)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
              }}
            >
              <dt className="type-h3" style={{ maxWidth: '28ch' }}>
                {item.question}
              </dt>
              <dd
                className="type-body-lg"
                style={{ margin: 0, color: 'var(--color-text-muted)', maxWidth: '64ch' }}
              >
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* CONS.06 — CTA */}
      <Section labelledBy="consulting-cta">
        <SectionHeader
          id="consulting-cta"
          label="CONS.06"
          title="Start with the problem."
          titleMaxCh={20}
          leadMaxCh={54}
          lead="Describe what's happening and what you need to be true instead. If I'm not the right person, I'll say so and point you somewhere better."
        />

        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
        >
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href="/projects" variant="ghost">
            See the work
          </Button>
        </div>

        {/* Consulting-specific direct email. This is the one CTA on the site
         * where the visitor's intent is unambiguously consulting, so it uses
         * the consulting@ alias rather than hello@ — inbound mail arrives
         * pre-sorted by intent. Understated so the form stays primary. */}
        <p style={{ marginTop: 'var(--space-6)' }}>
          <span className="type-body" style={{ color: 'var(--color-text-muted)' }}>
            Or email directly:{' '}
          </span>
          <a href={CONSULTING_INQUIRY.href} className="prose-link type-body">
            {CONSULTING_INQUIRY.address}
          </a>
        </p>
      </Section>
    </main>
  );
}
