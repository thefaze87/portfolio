import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceHero } from '@/components/marketing/ExperienceHero';
import { ExperienceCompetencies } from '@/components/marketing/ExperienceCompetencies';
import { ExperienceProgression } from '@/components/marketing/ExperienceProgression';
import { ExperienceCareer } from '@/components/marketing/ExperienceCareer';
import { ExperiencePrinciples } from '@/components/marketing/ExperiencePrinciples';
import { ExperienceLinks } from '@/components/marketing/ExperienceLinks';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Experience',
  description:
    '20+ years designing software, systems, and digital products — from developer to solutions architect across healthcare, retail, media, and enterprise platforms.',
  path: '/experience',
});

/**
 * Experience — the career record. One half of a deliberate pair:
 *
 *   Experience = what was accomplished professionally over 20+ years.
 *   Projects   = what gets architected and shipped independently.
 *
 * They answer different questions for different readers and are kept separate
 * on purpose. This page is the credibility that makes /projects read as the
 * output of two decades rather than as side projects.
 *
 * Composition: hero positioning → competency strip → the progression arc
 * (EXP.01, the visual trajectory) → the career as case studies (EXP.02, the
 * depth) → principles → a bridge to /projects → closing CTA.
 *
 * EXP.00 owns the page's only <h1>; every section below is an h2.
 *
 * <ExperienceRecommendations> is deliberately NOT rendered: it holds
 * placeholder quotes, and placeholder testimonials on a live page are worse
 * than none. It lives in /styleguide until real endorsements replace them.
 *
 * <SelectedWork> was removed from this page and is now SUPERSEDED, not moved:
 * /projects renders from content/projects/index.json with a three-tier
 * hierarchy, which does the same job better. SelectedWork and
 * content/experience/work.json survive only as styleguide specimens — delete
 * both once you're satisfied nothing else wants them.
 *
 * Server Component (no client islands).
 */
export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceHero />
      <ExperienceCompetencies />
      <ExperienceProgression />
      <ExperienceCareer />
      <ExperiencePrinciples />

      {/* Bridge to /projects. The two pages are a pair; each should hand the
       * reader to the other rather than dead-ending. */}
      <Section labelledBy="experience-to-projects">
        <SectionHeader
          id="experience-to-projects"
          label="EXP.04"
          title="The other half of the record."
          titleMaxCh={22}
          leadMaxCh={60}
          lead="Twenty years of this is what a résumé shows. What it doesn't show is what I build when nobody assigns it — platforms architected end to end, from domain model through deployment."
        />
        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-5)' }}
        >
          <Button href="/projects" variant="ghost">
            See the projects →
          </Button>
          <Link href="/about" className="cta-text type-body inline-flex items-center">
            How I think about this work →
          </Link>
        </div>
      </Section>

      <ExperienceLinks />
    </main>
  );
}
