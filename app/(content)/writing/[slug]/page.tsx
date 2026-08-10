import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { ArticleHeader } from '@/components/content/ArticleHeader';
import { mdxComponents } from '@/components/content/MDXComponents';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema, jsonLd } from '@/lib/schema';
import { formatDate, getAllEssays, getEssayBySlug } from '@/lib/mdx';
import { PILLAR_LABELS } from '@/lib/content-schemas';
import { NEWSLETTER } from '@/lib/nav';

/**
 * Essay detail. Statically generated per essay; MDX compile and Shiki
 * highlighting both happen at build time.
 *
 * Related essays are chosen by shared pillar first, then by recency, so a
 * reader who finished an architecture piece is offered more architecture
 * rather than whatever happened to be published next.
 *
 * Server Component.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllEssays().map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return {};

  return buildMetadata({
    title: essay.frontmatter.title,
    description: essay.frontmatter.excerpt,
    path: `/writing/${slug}`,
    type: 'article',
    ...(essay.frontmatter.canonicalUrl ? { canonicalUrl: essay.frontmatter.canonicalUrl } : {}),
  });
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const { content } = await compileMDX({
    source: essay.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const { frontmatter } = essay;

  const related = getAllEssays()
    .filter((other) => other.slug !== essay.slug)
    .sort((a, b) => {
      const aMatch = a.frontmatter.pillar === frontmatter.pillar ? 0 : 1;
      const bMatch = b.frontmatter.pillar === frontmatter.pillar ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 2);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        // Static, build-time JSON from lib/schema.ts. No user input reaches this.
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            articleSchema({
              title: frontmatter.title,
              description: frontmatter.excerpt,
              path: `/writing/${slug}`,
              publishedAt: frontmatter.publishedAt,
              updatedAt: frontmatter.updatedAt,
              section: PILLAR_LABELS[frontmatter.pillar],
              ...(frontmatter.canonicalUrl ? { canonicalUrl: frontmatter.canonicalUrl } : {}),
            }),
            breadcrumbSchema([
              { name: 'Writing', path: '/writing' },
              { name: frontmatter.title, path: `/writing/${slug}` },
            ]),
          ]),
        }}
      />

      {/* Header and body share one Container so the gap between them is a
       * controlled space-8, not the full --section-py a <Section> would put
       * between two separate bands. An article is one continuous unit. */}
      <Container>
        <div style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--space-9)' }}>
          <ArticleHeader
            kicker={PILLAR_LABELS[frontmatter.pillar]}
            title={frontmatter.title}
            standfirst={frontmatter.excerpt}
            meta={[
              {
                label: 'Published',
                value: formatDate(frontmatter.publishedAt),
                dateTime: frontmatter.publishedAt,
              },
              ...(frontmatter.updatedAt
                ? [
                    {
                      label: 'Updated',
                      value: formatDate(frontmatter.updatedAt),
                      dateTime: frontmatter.updatedAt,
                    },
                  ]
                : []),
              { label: 'Reading time', value: `${essay.readingMinutes} min` },
            ]}
            chips={frontmatter.tags}
          />

          <article style={{ marginTop: 'var(--space-8)' }}>{content}</article>

          {/* Cross-post attribution. Renders only for essays that also live on
           * Substack — those pages already declare Substack as canonical, so
           * the reader should be able to reach the version search engines are
           * pointed at (and where the comments and subscribe flow live). */}
          {frontmatter.canonicalUrl && (
            <p
              className="type-body"
              style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-5)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              Originally published in {NEWSLETTER.name}.{' '}
              <a
                href={frontmatter.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link"
              >
                Read it on Substack
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <Section labelledBy="essay-related">
          <h2 id="essay-related" className="type-h2">
            Related
          </h2>
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ marginTop: 'var(--space-6)', gap: 'var(--space-5)' }}
          >
            {related.map((other) => (
              <Card key={other.slug} interactive>
                <SectionLabel>{PILLAR_LABELS[other.frontmatter.pillar]}</SectionLabel>
                <h3 className="type-h3 card-title" style={{ marginTop: 'var(--space-4)' }}>
                  <a href={`/writing/${other.slug}`} style={{ color: 'inherit' }}>
                    {other.frontmatter.title}
                  </a>
                </h3>
                <p
                  className="type-body"
                  style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
                >
                  {other.frontmatter.excerpt}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section labelledBy="essay-cta">
        <h2 id="essay-cta" className="type-h2">
          Get the next one
        </h2>
        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-4)',
            color: 'var(--color-text-muted)',
            maxWidth: '54ch',
          }}
        >
          Essays go out to {NEWSLETTER.name} first.
        </p>
        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-6)', gap: 'var(--space-4)' }}
        >
          <Button href={NEWSLETTER.href} variant="primary">
            Subscribe →
          </Button>
          <Button href="/writing" variant="ghost">
            All writing
          </Button>
        </div>
      </Section>
    </main>
  );
}
