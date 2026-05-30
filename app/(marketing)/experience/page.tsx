import type { Metadata } from 'next';
import { ExperienceHero } from '@/components/marketing/ExperienceHero';
import { ExperienceCompetencies } from '@/components/marketing/ExperienceCompetencies';
import { ExperienceCareer } from '@/components/marketing/ExperienceCareer';
import { ExperiencePrinciples } from '@/components/marketing/ExperiencePrinciples';
import { SelectedWork } from '@/components/marketing/SelectedWork';
import { ExperienceRecommendations } from '@/components/marketing/ExperienceRecommendations';
import { ExperienceLinks } from '@/components/marketing/ExperienceLinks';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    '20+ years designing software, systems, and digital products — architecture, engineering leadership, AI strategy, and the outcomes behind them.',
};

/**
 * Experience — the portfolio page. Composition reads as an architectural
 * publication: hero positioning, a brief competency strip, the career as
 * case studies, the principles those decisions return to, a Selected Work
 * gallery, recommendations, and a closing call to action.
 *
 * EXP.00 Hero owns the page's only <h1>. EXP.01 → ARCH.02 → WORK.01 →
 * EXP.04/05 follow as h2 sections, each on the shared section shell so
 * the page reads as one continuous publication.
 *
 * Server Component (no client islands).
 */
export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceHero />
      <ExperienceCompetencies />
      <ExperienceCareer />
      <ExperiencePrinciples />
      <SelectedWork />
      <ExperienceRecommendations />
      <ExperienceLinks />
    </main>
  );
}
