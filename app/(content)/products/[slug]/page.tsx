import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { StatusChip } from '@/components/products/StatusChip';
import { Placeholder } from '@/components/products/Placeholder';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mdxComponents } from '@/components/content/MDXComponents';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd, softwareApplicationSchema } from '@/lib/schema';
import { getProductArticleBySlug, getProductById, getProducts } from '@/lib/mdx';

/**
 * Product detail — the permanent template for every product.
 *
 * Section order is fixed so products stay comparable to each other:
 *
 *   Hero (name · tagline · status · category)
 *   Overview
 *   Narrative (MDX: problem, solution, vision, architecture, lessons)
 *   Technologies · Markets
 *   Build state (built / in development / roadmap)
 *   Timeline
 *   Gallery      — placeholder until screenshots exist
 *   Links        — placeholder until there is somewhere to send people
 *   CTA
 *
 * Structured data comes from the registry (content/products/index.json);
 * narrative comes from the MDX body. Sections whose data is empty do not
 * render, so a Planned product is short rather than padded — except gallery
 * and links, which reserve their space deliberately (see Placeholder).
 *
 * Server Component. Statically generated per product.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProducts()
    .filter((product) => product.hasDetail)
    .map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductById(slug);
  const article = getProductArticleBySlug(slug);
  if (!product || !article) return {};

  return buildMetadata({
    title: `${product.name} — ${product.tagline}`,
    description: product.summary,
    path: `/products/${slug}`,
    type: 'article',
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductById(slug);
  const article = getProductArticleBySlug(slug);
  if (!product || !article) notFound();

  const { content } = await compileMDX({
    source: article.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
  });

  const chipStyle = {
    color: 'var(--color-text)',
    paddingBlock: 'var(--space-1)',
    paddingInline: 'var(--space-3)',
    border: 'var(--stroke-hairline) solid var(--color-border-strong)',
    borderRadius: 'var(--radius-xs)',
  } as const;

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // Static, build-time JSON from lib/schema.ts. No user input reaches this.
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            softwareApplicationSchema(product),
            breadcrumbSchema([
              { name: 'Products', path: '/products' },
              { name: product.name, path: `/products/${slug}` },
            ]),
          ]),
        }}
      />

      {/* Hero */}
      <Section divider={false} labelledBy="product-heading">
        <div
          className="flex flex-wrap items-center"
          style={{ gap: 'var(--space-3) var(--space-5)' }}
        >
          <StatusChip status={product.status} />
          <span className="type-mono-label" style={{ color: 'var(--color-text-dim)' }}>
            {product.category}
          </span>
        </div>

        <h1
          id="product-heading"
          className="type-display-lg"
          style={{ marginTop: 'var(--space-6)', maxWidth: '18ch' }}
        >
          {product.name}
        </h1>

        <p
          className="type-display-md"
          style={{ marginTop: 'var(--space-4)', color: 'var(--color-accent)', maxWidth: '24ch' }}
        >
          {product.tagline}
        </p>

        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-6)',
            color: 'var(--color-text-muted)',
            maxWidth: '64ch',
          }}
        >
          {product.summary}
        </p>
      </Section>

      {/* Narrative — problem, solution, vision, architecture, lessons */}
      <Container>
        <div
          style={{
            paddingTop: 'var(--section-py)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <article style={{ paddingBottom: 'var(--space-9)' }}>{content}</article>
        </div>
      </Container>

      {/* Technologies + markets */}
      {(product.stack.length > 0 || product.markets.length > 0) && (
        <Section labelledBy="product-stack">
          <h2 id="product-stack" className="type-h2">
            Built with
          </h2>
          {product.stack.length > 0 && (
            <ul
              className="flex flex-wrap"
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                marginTop: 'var(--space-6)',
                gap: 'var(--space-2) var(--space-3)',
              }}
            >
              {product.stack.map((tech) => (
                <li key={tech} className="type-mono-body" style={chipStyle}>
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {product.markets.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <SectionLabel>Who it serves</SectionLabel>
              <ul
                className="flex flex-wrap"
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                  gap: 'var(--space-2) var(--space-3)',
                }}
              >
                {product.markets.map((market) => (
                  <li key={market} className="type-mono-body" style={chipStyle}>
                    {market}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Build state — the honest split */}
      {product.buildState && (
        <Section labelledBy="product-state">
          <SectionHeader
            id="product-state"
            label="STATUS"
            title="What exists today."
            titleMaxCh={22}
            leadMaxCh={56}
            lead="Stated as three separate lists rather than one feature grid, because a roadmap presented as a product is the thing that makes most product pages untrustworthy."
          />
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ marginTop: 'var(--space-8)', gap: 'var(--space-5)' }}
          >
            {(
              [
                ['Built', product.buildState.built, 'var(--color-accent)'],
                ['In development', product.buildState.inDevelopment, 'var(--color-text-muted)'],
                ['Roadmap', product.buildState.roadmap, 'var(--color-text-dim)'],
              ] as const
            ).map(([label, items, color]) =>
              items.length === 0 ? null : (
                <Card key={label}>
                  <span className="type-mono-label" style={{ color }}>
                    {label}
                  </span>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      marginTop: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {items.map((item) => (
                      <li
                        key={item}
                        className="type-body-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ),
            )}
          </div>
        </Section>
      )}

      {/* Timeline */}
      {product.timeline.length > 0 && (
        <Section labelledBy="product-timeline">
          <h2 id="product-timeline" className="type-h2">
            Timeline
          </h2>
          <ol
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              marginTop: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {product.timeline.map((entry, i) => (
              <li
                key={`${entry.date}-${entry.event}`}
                className="grid grid-cols-1 sm:grid-cols-[10rem_1fr]"
                style={{
                  gap: 'var(--space-2) var(--space-6)',
                  paddingBlock: 'var(--space-5)',
                  borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                }}
              >
                <span
                  className="type-mono-label nums-tabular"
                  style={{
                    color:
                      i === product.timeline.length - 1
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
                  }}
                >
                  {entry.date}
                </span>
                <span className="type-body" style={{ color: 'var(--color-text-muted)' }}>
                  {entry.event}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Gallery + links — reserved, not omitted */}
      <Section labelledBy="product-media">
        <h2 id="product-media" className="sr-only">
          Gallery and links
        </h2>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
          style={{ gap: 'var(--space-7)' }}
        >
          <Placeholder
            label="Gallery"
            caption={`Interface and architecture figures for ${product.name} will appear here.`}
          />
          {product.links.length > 0 ? (
            <div>
              <SectionLabel>Links</SectionLabel>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                {product.links.map((link) => (
                  <li key={link.href}>
                    <Button href={link.href} variant="text">
                      {link.label} →
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Placeholder
              label="Links"
              aspect="flat"
              caption={
                product.status === 'Launching'
                  ? 'Live site and product links at launch.'
                  : 'Links appear once there is somewhere to send you.'
              }
            />
          )}
        </div>
      </Section>

      <Section labelledBy="product-cta">
        <h2 id="product-cta" className="type-h2">
          Questions about {product.name}?
        </h2>
        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-6)', gap: 'var(--space-4)' }}
        >
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href="/products" variant="ghost">
            All products
          </Button>
        </div>
      </Section>
    </main>
  );
}
