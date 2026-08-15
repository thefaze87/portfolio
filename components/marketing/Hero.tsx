import { Fragment } from 'react';
import Link from 'next/link';
import { EyebrowLabel } from '@/components/brand/EyebrowLabel';
import { HeroMasthead } from '@/components/marketing/HeroMasthead';
import { TopologyHero } from '@/components/diagrams/TopologyHero';

/** Hero eyebrow roles — distinct from the footer set. Rendered as nowrap
 *  units so the line can only break between roles. */
const HERO_ROLES = ['Systems Architect', 'AI Strategist', 'Engineering Leader'] as const;

/**
 * Hero — homepage above-the-fold composition.
 *
 * Two columns on desktop (text left, topology diagram right), stacked on
 * mobile (diagram below the text). The LCP element is the Fraunces <h1>,
 * server-rendered text — the diagram is inline SVG that animates in via CSS
 * without blocking paint.
 *
 * Server Component. Orange appears exactly where the brand allows it: the
 * critical takeaway "scale" (text emphasis), the single primary CTA (the one
 * orange interactive element), and the diagram's critical path.
 */
export function Hero() {
  const ctaPadding = 'var(--space-4) var(--space-6)';

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <HeroMasthead />
      <div
        className="mx-auto grid grid-cols-1 items-center lg:grid-cols-[1.15fr_0.85fr]"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--space-9)',
          gap: 'var(--space-8)',
        }}
      >
        {/* Text column */}
        <div>
          <EyebrowLabel>
            {HERO_ROLES.map((role, i) => (
              <Fragment key={role}>
                {i > 0 ? ' ' : ''}
                <span style={{ whiteSpace: 'nowrap' }}>
                  {role}
                  {i < HERO_ROLES.length - 1 ? ' ·' : ''}
                </span>
              </Fragment>
            ))}
          </EyebrowLabel>

          <h1 className="type-hero-h1" style={{ marginTop: 'var(--space-5)' }}>
            Better systems.
            <br />
            Better decisions.
            <br />
            Built to <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>scale</em>.
          </h1>

          {/* Problem-first, not identity-first.
           *
           * This previously read "I help organizations design scalable
           * systems, leverage AI effectively, and align technology with
           * business outcomes" — three abstractions a visitor cannot match
           * against their own situation, followed by a second paragraph that
           * opened with "I help" again and repeated the same claim about
           * better technical decisions that EXP.01 already made.
           *
           * Naming the three situations people actually arrive with lets a
           * reader recognise themselves in the first four seconds. The
           * capability vocabulary (modernization, AI, architecture, frontend
           * systems, leadership, accessibility) is carried by the sentences
           * rather than listed as services. */}
          <p
            className="type-body-lg"
            style={{ marginTop: 'var(--space-6)', maxWidth: '52ch', color: 'var(--color-text)' }}
          >
            Platforms that have grown expensive to change. AI programs that need a decision before a
            budget. Architecture that several teams have to agree on. That is the work I get called
            for.
          </p>
          <p
            className="type-body"
            style={{
              marginTop: 'var(--space-4)',
              maxWidth: '56ch',
              color: 'var(--color-text-muted)',
            }}
          >
            Twenty years of it — enterprise architecture, platform modernization, frontend systems,
            technical leadership, and accessibility — across healthcare, retail, media, education,
            and SaaS.
          </p>

          <div
            className="flex flex-col sm:flex-row"
            style={{ gap: 'var(--space-4)', marginTop: 'var(--space-7)' }}
          >
            <Link
              href="/experience"
              className="cta-primary type-body inline-flex items-center justify-center"
              style={{ padding: ctaPadding }}
            >
              View Experience
            </Link>
            <Link
              href="/contact"
              className="cta-ghost type-body inline-flex items-center justify-center"
              style={{ padding: ctaPadding }}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>

        {/* Diagram column */}
        <div className="flex items-center justify-center">
          <TopologyHero />
        </div>
      </div>
    </section>
  );
}
