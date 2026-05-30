import type { Metadata } from 'next';
import { ExperienceHero } from '@/components/marketing/ExperienceHero';
import { ExperienceCareer } from '@/components/marketing/ExperienceCareer';
import { ExperienceMetrics } from '@/components/marketing/ExperienceMetrics';
import { ExperienceLeadership } from '@/components/marketing/ExperienceLeadership';
import { ExperienceRecommendations } from '@/components/marketing/ExperienceRecommendations';
import { ExperienceLinks } from '@/components/marketing/ExperienceLinks';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    '20+ years designing software, systems, and digital products — architecture, engineering leadership, AI strategy, and the outcomes behind them.',
};

/**
 * Experience — the full career page. EXP.00 hero owns the page's only <h1>;
 * EXP.01–05 follow as h2 sections (career, metrics, leadership,
 * recommendations, links), each on the shared section shell so the page reads
 * as one continuous publication. Header and Footer come from the root layout.
 *
 * Server Component (no client islands).
 */
export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceHero />
      <ExperienceCareer />
      <ExperienceMetrics />
      <ExperienceLeadership />
      <ExperienceRecommendations />
      <ExperienceLinks />
    </main>
  );
}
