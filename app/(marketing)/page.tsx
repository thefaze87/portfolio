import { Hero } from '@/components/marketing/Hero';
import { TrustBar } from '@/components/marketing/TrustBar';
import { ArchitecturePhilosophy } from '@/components/marketing/ArchitecturePhilosophy';
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline';
import { IndustriesGrid } from '@/components/marketing/IndustriesGrid';
import { ExperienceMore } from '@/components/marketing/ExperienceMore';
import { HomeClosing } from '@/components/marketing/HomeClosing';

/**
 * Home — the marketing homepage. Lives in the (marketing) route group so it
 * sits alongside about/consulting/etc. while still serving "/". Header and
 * Footer come from the root layout.
 *
 * <HomeClosing> is load-bearing: without it the page ended on an outbound
 * LinkedIn link, making "leave the site" the final available action on the
 * highest-traffic page.
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
      <HomeClosing />
    </main>
  );
}
