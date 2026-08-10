import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { FOOTER_NAV_LINKS, PRIMARY_CTA } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * Branded 404. Replaces the default Next.js error page, which shipped no
 * navigation, no branding, and no recovery path.
 *
 * It renders inside the root layout, so the header, footer, and skip link are
 * present — a visitor who lands here already has a way out. The links below
 * are the belt-and-braces version of that: every published route, plus the
 * primary CTA.
 *
 * `robots: index false, follow true` — don't index the error page, but do let
 * crawlers follow the recovery links out of it.
 *
 * Server Component.
 */
export default function NotFound() {
  return (
    <main id="main-content">
      <Section divider={false} labelledBy="not-found-heading">
        <SectionHeader
          id="not-found-heading"
          label="ERROR · 404"
          as="h1"
          size="display-lg"
          title="This page doesn't exist."
          titleMaxCh={18}
          leadMaxCh={52}
          lead="Either the address is wrong, or something moved. Here's everything that does exist."
        />

        <nav aria-label="Recovery" style={{ marginTop: 'var(--space-8)' }}>
          <ul
            className="flex flex-wrap"
            style={{ listStyle: 'none', margin: 0, padding: 0, gap: 'var(--space-4)' }}
          >
            <li>
              <Button href="/" variant="ghost">
                Home
              </Button>
            </li>
            {FOOTER_NAV_LINKS.filter((link) => link.href !== PRIMARY_CTA.href).map((link) => (
              <li key={link.href}>
                <Button href={link.href} variant="ghost">
                  {link.label}
                </Button>
              </li>
            ))}
            <li>
              <Button href={PRIMARY_CTA.href} variant="primary">
                {PRIMARY_CTA.label}
              </Button>
            </li>
          </ul>
        </nav>
      </Section>
    </main>
  );
}
