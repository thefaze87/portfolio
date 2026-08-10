import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ArticleHeader } from '@/components/content/ArticleHeader';
import { mdxComponents } from '@/components/content/MDXComponents';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema, jsonLd } from '@/lib/schema';
import { formatDate, getAllProjects, getProjectBySlug } from '@/lib/mdx';

/**
 * Case study detail.
 *
 * Statically generated for every published case study via generateStaticParams,
 * so the MDX compile and the Shiki highlighting happen at build time and the
 * page ships no JavaScript for its content.
 *
 * Server Component.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjects().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getProjectBySlug(slug);
  if (!study) return {};

  return buildMetadata({
    title: study.frontmatter.title,
    description: study.frontmatter.excerpt,
    path: `/projects/${slug}`,
    type: 'article',
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getProjectBySlug(slug);
  if (!study) notFound();

  const { content } = await compileMDX({
    source: study.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const { frontmatter } = study;

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
              path: `/projects/${slug}`,
              publishedAt: frontmatter.publishedAt,
              updatedAt: frontmatter.updatedAt,
              section: 'Case Study',
            }),
            breadcrumbSchema([
              { name: 'Projects', path: '/projects' },
              { name: frontmatter.title, path: `/projects/${slug}` },
            ]),
          ]),
        }}
      />

      {/* Header and body share one Container so the gap between them is a
       * controlled space-8, not the full --section-py a <Section> would put
       * between two separate bands. An article is one continuous unit. */}
      <Container>
        <div style={{ paddingTop: 'var(--section-py)' }}>
          <ArticleHeader
            kicker={`Case study · ${frontmatter.client}`}
            title={frontmatter.title}
            standfirst={frontmatter.excerpt}
            meta={[
              { label: 'Role', value: frontmatter.role },
              { label: 'Period', value: frontmatter.period },
              {
                label: 'Published',
                value: formatDate(frontmatter.publishedAt),
                dateTime: frontmatter.publishedAt,
              },
              { label: 'Reading time', value: `${study.readingMinutes} min` },
            ]}
            chips={frontmatter.stack}
          />

          <article style={{ marginTop: 'var(--space-8)', paddingBottom: 'var(--space-9)' }}>
            {content}
          </article>
        </div>
      </Container>

      <Section>
        <div className="flex flex-wrap" style={{ gap: 'var(--space-4)' }}>
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href="/projects" variant="ghost">
            All case studies
          </Button>
        </div>
      </Section>
    </main>
  );
}
