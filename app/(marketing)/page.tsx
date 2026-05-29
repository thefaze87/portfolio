import { Hero } from '@/components/marketing/Hero';
import { TrustBar } from '@/components/marketing/TrustBar';
import { ArchitecturePhilosophy } from '@/components/marketing/ArchitecturePhilosophy';
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline';
import { IndustriesGrid } from '@/components/marketing/IndustriesGrid';
import { ExperienceMore } from '@/components/marketing/ExperienceMore';

/**
 * Home — the marketing homepage. Lives in the (marketing) route group so it
 * sits alongside about/consulting/etc. while still serving "/". Header and
 * Footer come from the root layout; this page owns the above-the-fold system,
 * the architecture-philosophy section, and the experience narrative.
 */
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <TrustBar />
      <ArchitecturePhilosophy />
      <ExperienceTimeline />
      <IndustriesGrid />
      <ExperienceMore />
    </main>
  );
}
