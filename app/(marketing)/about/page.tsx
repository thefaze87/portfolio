import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/lib/seo';
import { faqSchema, jsonLd, profilePageSchema } from '@/lib/schema';
import { EXPERIENCE_LINK, LINKEDIN_HREF, SITE_LOCATION } from '@/lib/nav';
import faqData from '@/content/about/faq.json';
import timelineData from '@/content/experience/timeline.json';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Mark Fasel is a solutions architect in the Tampa Bay area with 20+ years across healthcare, retail, media, and enterprise platforms. Architecture and AI.',
  path: '/about',
});

/**
 * About — the trust page. Both audiences land here second: the buyer wants to
 * know whose judgment they'd be renting, the hiring decision-maker wants to
 * know how this person thinks.
 *
 * Structure is deliberate for AI extraction as much as for humans: the first
 * paragraph is a plain declarative summary (that's the sentence that gets
 * cited), headings run in clean order, and credentials appear as lists rather
 * than prose because LLMs parse lists more reliably.
 *
 * This page also carries the /experience link. That link is what allows the
 * transitional Experience entry to drop out of the header — see lib/nav.ts.
 *
 * Server Component, no client islands.
 */

const FAQ = faqData as { question: string; answer: string }[];
const { roles: TIMELINE, parallel: PARALLEL } = timelineData as {
  roles: { org: string; role: string; dates: string }[];
  parallel: { org: string; role: string; dates: string };
};

/** How I think about building systems. These are the same four principles the
 *  homepage states — repeated here deliberately, because About is where a
 *  visitor comes to find out whether they're real. */
const ENGINEERING_PRINCIPLES = [
  {
    n: '01',
    title: 'Systems over tools',
    body: 'Frameworks change every three years. The reasons a system fails do not. I optimize for the decisions that survive the next rewrite.',
  },
  {
    n: '02',
    title: 'Business before code',
    body: 'Technology exists to produce an outcome. If I cannot state the outcome in a sentence a CFO would recognize, the architecture is not ready.',
  },
  {
    n: '03',
    title: 'AI with intent',
    body: 'AI should improve decisions, not replace thinking. Most failed AI projects were never decision problems — they were process problems with a model bolted on.',
  },
  {
    n: '04',
    title: 'Alignment creates scale',
    body: 'Most scaling problems begin as communication problems. Systems mirror the organizations that build them, so fixing the system usually means fixing an ownership boundary first.',
  },
] as const;

/** How I work with teams. Distinct from the engineering principles above —
 *  this is the leadership half, which is what a VP is actually evaluating. */
const LEADERSHIP_PRINCIPLES = [
  {
    n: '01',
    title: 'Decisions get written down',
    body: 'An undocumented decision is a decision the team will relitigate in six months. I write down what we chose, what we chose against, and what would make us change our minds.',
  },
  {
    n: '02',
    title: 'Constraints are stated out loud',
    body: 'Teams do not fail because they picked the wrong framework. They fail because two people held incompatible assumptions and neither said so.',
  },
  {
    n: '03',
    title: 'The architect stays close to the code',
    body: 'Architecture that has not been checked against the codebase in a year is fiction. I keep my hands in the work, because the diagram is not the system.',
  },
  {
    n: '04',
    title: 'Teach the reasoning, not the answer',
    body: 'The goal is a team that makes good decisions when I am not in the room. Handing down conclusions produces dependence; handing down the reasoning produces architects.',
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // Static, build-time JSON from lib/schema.ts. No user input reaches this.
        dangerouslySetInnerHTML={{
          __html: jsonLd([profilePageSchema(), faqSchema(FAQ)]),
        }}
      />

      {/* ABOUT.00 — opener. The lead paragraph is written to be quotable on its
       * own, because that is the unit an LLM or a search snippet extracts. */}
      <Section divider={false} labelledBy="about-heading">
        <SectionHeader
          id="about-heading"
          label="ABOUT"
          as="h1"
          size="display-lg"
          title="I make the technical decisions that are expensive to reverse."
          titleMaxCh={24}
          leadMaxCh={62}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                I&apos;m Mark Fasel, a solutions architect based in {SITE_LOCATION}. I work where
                architecture, engineering leadership, and AI strategy meet — designing the
                boundaries, contracts, and integrations that determine whether a system stays clear
                as it grows.
              </p>
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                Twenty years of it, across healthcare, retail, ecommerce, media, education, and
                enterprise platforms. Long enough to have been wrong in most of the interesting
                ways.
              </p>
            </>
          }
        />
      </Section>

      {/* ABOUT.01 — narrative */}
      <Section labelledBy="about-story">
        <SectionHeader
          id="about-story"
          label="ABOUT.01"
          title="How I got here."
          titleMaxCh={20}
          leadMaxCh={68}
          lead={
            <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                I started out building things for whoever would pay me, years before I had any
                business calling myself an architect. That work taught me faster than a job would
                have: when you are the only person on an engagement, you cannot hide behind a team,
                and every decision you make comes back to you.
              </p>
              <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
                The first decade in-house was healthcare. Four years at Johns Hopkins All
                Children&apos;s Hospital building clinical, research, and operational platforms in
                an environment where &quot;we&apos;ll fix it in the next release&quot; is not an
                available answer. Regulated, high-reliability work rearranges how you think about
                failure — you stop designing for the happy path and start designing for the day
                something goes wrong at 3am.
              </p>
              <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
                Then scale, in different shapes. Ramsey Solutions, building for millions of people
                across personal finance and media. Publix, on customer-facing ordering systems
                inside one of the largest employee-owned companies in the country. Four years at
                Scorpion leading frontend architecture and design systems — the foundation multiple
                product teams built on top of, which is where I learned that a design system is an
                organizational agreement wearing a component library as a disguise.
              </p>
              <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
                More recently the work moved toward integration and strategy: enterprise financial
                and aviation data platforms at Roghnu, and now enterprise solutions architecture at
                Life Surge — setting system boundaries, integration patterns, and AI strategy across
                multiple engineering teams, working directly with executive stakeholders.
              </p>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                The independent practice never stopped — Mark Fasel, LLC has run alongside the
                in-house roles since 2014. It is the part of the résumé that best explains how I
                think: I have spent twenty years walking into systems I did not build and being
                asked what to do about them.
              </p>
            </div>
          }
        />
      </Section>

      {/* ABOUT.02 — engineering philosophy */}
      <Section labelledBy="about-engineering">
        <SectionHeader
          id="about-engineering"
          label="ABOUT.02"
          title="How I think about systems."
          titleMaxCh={22}
          lead="Four positions I hold, and would defend."
        />

        <ul
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            gap: 'var(--space-5)',
          }}
        >
          {ENGINEERING_PRINCIPLES.map((p) => (
            <Card as="li" key={p.n}>
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {p.n}
              </span>
              <h3 className="type-h3" style={{ marginTop: 'var(--space-5)' }}>
                {p.title}
              </h3>
              <p
                className="type-body"
                style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
              >
                {p.body}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ABOUT.03 — leadership philosophy */}
      <Section labelledBy="about-leadership">
        <SectionHeader
          id="about-leadership"
          label="ABOUT.03"
          title="How I work with teams."
          titleMaxCh={22}
          lead="Architecture is a team sport played badly by people who think it isn't."
        />

        <ul
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            gap: 'var(--space-5)',
          }}
        >
          {LEADERSHIP_PRINCIPLES.map((p) => (
            <Card as="li" key={p.n}>
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {p.n}
              </span>
              <h3 className="type-h3" style={{ marginTop: 'var(--space-5)' }}>
                {p.title}
              </h3>
              <p
                className="type-body"
                style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
              >
                {p.body}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ABOUT.04 — timeline preview. This section carries the /experience link
       * that lets Experience leave the primary nav. */}
      <Section labelledBy="about-timeline">
        <SectionHeader
          id="about-timeline"
          label="ABOUT.04"
          title="The record."
          titleMaxCh={20}
          lead="Seven roles, one continuous consulting practice, and the industries behind them."
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
          {TIMELINE.map((entry, i) => (
            <li
              key={entry.org}
              className="grid grid-cols-1 sm:grid-cols-[10rem_1fr]"
              style={{
                gap: 'var(--space-2) var(--space-6)',
                paddingBlock: 'var(--space-5)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
              }}
            >
              <span
                className="type-mono-label nums-tabular"
                style={{
                  color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  paddingTop: 'var(--space-1)',
                }}
              >
                {entry.dates}
              </span>
              <span>
                <span className="type-h3" style={{ display: 'block' }}>
                  {entry.org}
                </span>
                <span
                  className="type-body"
                  style={{
                    display: 'block',
                    marginTop: 'var(--space-1)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {entry.role}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div
          style={{
            marginTop: 'var(--space-7)',
            paddingTop: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <span className="type-mono-label nums-tabular" style={{ color: 'var(--color-accent)' }}>
            Parallel practice · {PARALLEL.dates}
          </span>
          <p className="type-h3" style={{ marginTop: 'var(--space-3)' }}>
            {PARALLEL.org}
          </p>
          <p
            className="type-body"
            style={{ marginTop: 'var(--space-1)', color: 'var(--color-text-muted)' }}
          >
            {PARALLEL.role} — running alongside every role above.
          </p>
        </div>

        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-5)' }}
        >
          <Button href={EXPERIENCE_LINK.href} variant="text">
            The full experience, role by role →
          </Button>
          <Button href={LINKEDIN_HREF} variant="text">
            LinkedIn →
          </Button>
        </div>
      </Section>

      {/* ABOUT.05 — FAQ. Carries FAQPage schema; also the section most likely
       * to be quoted verbatim by an AI assistant answering "who is Mark Fasel". */}
      <Section labelledBy="about-faq">
        <SectionHeader
          id="about-faq"
          label="ABOUT.05"
          title="Questions I get asked."
          titleMaxCh={22}
        />

        <dl style={{ margin: 0, marginTop: 'var(--space-8)' }}>
          {FAQ.map((item) => (
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

      {/* ABOUT.06 — split CTA. Two audiences, two next steps. */}
      <Section labelledBy="about-cta">
        <SectionHeader
          id="about-cta"
          label="ABOUT.06"
          title="Where to go next."
          titleMaxCh={20}
          leadMaxCh={54}
          lead="If you're evaluating me for an engagement, start a conversation. If you're evaluating me for a role, the full record is one click away."
        />

        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
        >
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href={EXPERIENCE_LINK.href} variant="ghost">
            View experience
          </Button>
        </div>
      </Section>
    </main>
  );
}
