import { Hero } from '@/components/marketing/Hero';
import { TrustBar } from '@/components/marketing/TrustBar';
import { ArchitecturePhilosophy } from '@/components/marketing/ArchitecturePhilosophy';

/**
 * Home — the marketing homepage. Lives in the (marketing) route group so it
 * sits alongside about/consulting/etc. while still serving "/". Header and
 * Footer come from the root layout; this page owns the above-the-fold system
 * and the architecture-philosophy section.
 */
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <TrustBar />
      <ArchitecturePhilosophy />
    </main>
  );
}
