import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { StatusChip } from '@/components/products/StatusChip';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/lib/seo';
import { getProducts } from '@/lib/mdx';
import { PRODUCT_STATUSES, type Product } from '@/lib/content-schemas';

export const metadata: Metadata = buildMetadata({
  title: 'Products',
  description:
    'Ventures I own and am building — Helixon, TrustLaunch, Opsly, and Clue Finder Tours. Commerce, reputation intelligence, and business automation.',
  path: '/products',
});

/**
 * Products — the permanent home for ventures Mark owns.
 *
 * The line against /projects is ownership: Projects is work he was hired to
 * do, Products is what he owns and is building. That distinction is why these
 * are separate collections with different content models — a product has a
 * lifecycle (status, roadmap, timeline), an engagement has a client and a
 * period. Helixon, Opsly, Clue Finder, and TrustLaunch moved here from
 * /projects, with permanent redirects.
 *
 * Ordering is by lifecycle rather than by date: Launching, then In
 * development, then Planned. A visitor scanning the page should be able to
 * read readiness top-to-bottom without parsing dates.
 *
 * Products without an MDX body (`hasDetail` false) render as cards with no
 * CTA rather than linking to a page that does not exist — the same gating
 * discipline as lib/nav.ts.
 *
 * Server Component.
 */

/** Lifecycle order for display. Derived from the status enum so adding a
 *  status can't silently sort it to the bottom. */
const STATUS_ORDER = new Map(PRODUCT_STATUSES.map((s, i) => [s, i]));

function StackChips({ stack }: { stack: readonly string[] }) {
  if (stack.length === 0) return null;
  return (
    <ul
      className="flex flex-wrap"
      style={{ listStyle: 'none', margin: 0, padding: 0, gap: 'var(--space-2) var(--space-3)' }}
    >
      {stack.map((tech) => (
        <li
          key={tech}
          className="type-mono-body"
          style={{
            color: 'var(--color-text)',
            paddingBlock: 'var(--space-1)',
            paddingInline: 'var(--space-3)',
            border: 'var(--stroke-hairline) solid var(--color-border-strong)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ProductCard({ product }: { product: Product }) {
  const href = product.hasDetail ? `/products/${product.id}` : null;

  return (
    <Card as="article" padding="lg" interactive={Boolean(href)}>
      <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-3) var(--space-5)' }}>
        <StatusChip status={product.status} />
        <span className="type-mono-label" style={{ color: 'var(--color-text-dim)' }}>
          {product.category}
        </span>
      </div>

      <h3
        className="type-display-md card-title"
        style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}
      >
        {href ? (
          <Link href={href} style={{ color: 'inherit' }}>
            {product.name}
          </Link>
        ) : (
          product.name
        )}
      </h3>

      <p
        className="type-body-lg"
        style={{ marginTop: 'var(--space-3)', color: 'var(--color-accent)' }}
      >
        {product.tagline}
      </p>

      <p
        className="type-body-lg"
        style={{
          marginTop: 'var(--space-5)',
          color: 'var(--color-text-muted)',
          maxWidth: '68ch',
        }}
      >
        {product.summary}
      </p>

      {product.highlights.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            maxWidth: '68ch',
          }}
        >
          {product.highlights.map((item) => (
            <li
              key={item}
              className="type-body"
              style={{ color: 'var(--color-text-muted)', display: 'flex', gap: 'var(--space-3)' }}
            >
              <span aria-hidden="true" style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {product.stack.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <StackChips stack={product.stack} />
        </div>
      )}

      {href ? (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button href={href} variant="text">
            {product.status === 'In development' ? 'Explore architecture' : 'View product'} →
          </Button>
        </div>
      ) : (
        <p
          className="type-body-sm"
          style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-dim)' }}
        >
          Write-up in progress.
        </p>
      )}
    </Card>
  );
}

export default function ProductsPage() {
  const products = [...getProducts()].sort(
    (a, b) => (STATUS_ORDER.get(a.status) ?? 99) - (STATUS_ORDER.get(b.status) ?? 99),
  );

  return (
    <main id="main-content">
      <Section divider={false} labelledBy="products-heading">
        <SectionHeader
          id="products-heading"
          label="PRODUCTS"
          as="h1"
          size="display-lg"
          title="Things I own, not things I was hired for."
          titleMaxCh={24}
          leadMaxCh={64}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                Ventures built end to end — commerce, reputation intelligence, business automation,
                and location-based experiences. Each is a real business rather than a portfolio
                exercise, which is why the status on each one is stated plainly.
              </p>
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                Client and employer engineering work lives on{' '}
                <Link href="/projects" className="prose-link">
                  Projects
                </Link>
                .
              </p>
            </>
          }
        />

        {/* Legend. Three states, stated once, so a reader knows how to read the
         * chips before they encounter them. */}
        <div
          className="flex flex-wrap items-center"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-4)' }}
        >
          <SectionLabel>Status</SectionLabel>
          {PRODUCT_STATUSES.map((status) => (
            <StatusChip key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section labelledBy="products-list">
        <h2 id="products-list" className="sr-only">
          All products
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section labelledBy="products-cta">
        <SectionHeader
          id="products-cta"
          label="PRODUCTS.CTA"
          title="Building something like this?"
          titleMaxCh={24}
          leadMaxCh={54}
          lead="Most of what I know about architecture came from having to run these, not from advising on them. If that's useful to you, start a conversation."
        />
        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
        >
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href="/consulting" variant="ghost">
            How I work
          </Button>
        </div>
      </Section>
    </main>
  );
}
