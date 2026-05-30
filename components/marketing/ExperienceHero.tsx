import { SectionLabel } from '@/components/brand/SectionLabel';
import { ExperiencePortrait } from '@/components/experience/ExperiencePortrait';

/**
 * ExperienceHero — EXP.00. The editorial opener for the /experience page and
 * the page's only <h1>. Two-column composition on desktop: left holds the
 * label + headline + lead lines (max-width 640px), right holds the portrait
 * sitting flush against the section's bottom edge with a subtle blueprint
 * backdrop. On mobile it collapses to a single column (headline → copy →
 * portrait → next section).
 *
 * Layout discipline lives in .exp-hero / .exp-hero-content / .exp-hero-portrait
 * (globals.css) because the breakpoint switch needs real media queries.
 * Portrait + blueprint concerns are encapsulated in ExperiencePortrait so
 * this file stays focused on page-level composition.
 *
 * Server Component. As the first section it carries no top divider —
 * generous top padding separates it from the site header instead.
 */
export function ExperienceHero() {
  return (
    <section style={{ position: 'relative' }}>
      {/* Aether Fox-style ghost typography. Spans the entire hero width so
       * the photo's coverage doesn't erase the effect; clipped at the
       * viewport edges by `body { overflow-x: clip }`. aria-hidden because
       * it's purely atmospheric. Hidden on mobile. */}
      <div className="exp-hero-ghost exp-blueprint-desktop" aria-hidden="true">
        <span>ARCHITECTURE</span>
      </div>

      <div
        className="exp-hero mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
        }}
      >
        <div className="exp-hero-content">
          <SectionLabel>EXP.00</SectionLabel>

          <h1 className="type-display-lg" style={{ marginTop: 'var(--space-5)', maxWidth: '18ch' }}>
            20+ years designing software, systems, and digital products.
          </h1>

          <div style={{ marginTop: 'var(--space-6)', maxWidth: '62ch' }}>
            <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
              I work where architecture, engineering leadership, and AI strategy meet — designing
              integrations and interfaces that stay clear as systems grow.
            </p>
            <p
              className="type-body-lg"
              style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
            >
              Across healthcare, ecommerce, education, and enterprise platforms, the work is the
              same: better technical decisions, durable systems, and measurable business outcomes.
            </p>
          </div>
        </div>

        <div className="exp-hero-portrait">
          <ExperiencePortrait />
        </div>
      </div>
    </section>
  );
}
