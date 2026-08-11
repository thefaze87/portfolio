import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { SubstackPosts } from '@/components/content/SubstackPosts';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { blogSchema, collectionPageSchema, jsonLd, newsletterSchema } from '@/lib/schema';
import { formatDate, getAllEssays } from '@/lib/mdx';
import { PILLARS, PILLAR_LABELS } from '@/lib/content-schemas';
import { NEWSLETTER } from '@/lib/nav';
import { SUBSTACK_URL, getSubstackPosts } from '@/lib/substack';

export const metadata: Metadata = buildMetadata({
  title: 'Writing',
  description:
    'Essays on software architecture, systems thinking, AI, engineering leadership, and product development — from 20+ years building enterprise systems.',
  path: '/writing',
});

/**
 * Writing — the site's writing hub, and a discovery surface for two sources.
 *
 * ## Division of labour with Substack
 *
 * Substack is the publishing platform and the newsletter. This site is the
 * discovery and archive surface. Nothing is duplicated:
 *
 *   - WRITING.01 surfaces recent Substack posts live from the publication's
 *     RSS feed. Titles and excerpts only — every link goes to Substack, which
 *     stays canonical for that content. The full body is never reproduced here.
 *   - WRITING.02 lists essays authored *for this site*. They exist nowhere
 *     else, so their canonical URL is here. An essay later cross-posted to
 *     Substack sets `canonicalUrl` in its frontmatter, which repoints
 *     rel="canonical" at Substack and surfaces a "Read it on Substack" link —
 *     so a cross-post can never become a second competing canonical.
 *
 * The two sections have zero title overlap today; they are different bodies of
 * work, not two copies of one.
 *
 * ## Rendering mode
 *
 * The Substack fetch carries `revalidate: 3600`, which makes this route ISR
 * rather than fully static. That is the intended trade: a newsletter that
 * publishes a few times a month should not require a redeploy to appear. A
 * failed or slow feed degrades to the empty state (see SubstackPosts) instead
 * of failing the render or the build.
 *
 * Pillar counts describe the local essays only, which is why they sit inside
 * WRITING.02 rather than in the page header. They are NOT interactive — pillar
 * hub routes are a later phase, and shipping a filter that doesn't filter is
 * worse than shipping none.
 *
 * Server Component.
 */
export default async function WritingPage() {
  // Requested concurrently with nothing else, but awaited before render: the
  // essays read is synchronous fs, the feed is network.
  const posts = await getSubstackPosts(3);

  const essays = getAllEssays();
  const [lead, ...rest] = essays;

  const pillarCounts = PILLARS.map((pillar) => ({
    pillar,
    label: PILLAR_LABELS[pillar],
    count: essays.filter((e) => e.frontmatter.pillar === pillar).length,
  }));

  return (
    <main id="main-content">
      {/* Three nodes, describing three different things about this URL:
       *
       *   CollectionPage  the page, and everything enumerated on it
       *   Blog            the publication those essays are instalments of
       *   Blog (Substack) the newsletter, identified by its own canonical URL
       *
       * A page and a publication are not the same entity, which is why both
       * exist without duplicating each other — `mainEntityOfPage` on the Blog
       * joins them. The newsletter is identity-only: its posts are canonical to
       * Substack, so they appear here as ItemList entries pointing at their
       * real URLs rather than as content this page claims to host. */}
      <script
        type="application/ld+json"
        // Build-time / ISR JSON from validated frontmatter and the parsed
        // feed. No user input reaches this string.
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            collectionPageSchema({
              name: 'Writing by Mark Fasel',
              description:
                'Essays on software architecture, systems thinking, AI, engineering leadership, and product development.',
              path: '/writing',
              items: [
                ...posts.map((post) => ({
                  name: post.title,
                  description: post.excerpt,
                  url: post.url,
                })),
                ...essays.map((essay) => ({
                  name: essay.frontmatter.title,
                  description: essay.frontmatter.excerpt,
                  id: absoluteUrl(`/writing/${essay.slug}#article`),
                })),
              ],
            }),
            blogSchema(essays.map((essay) => absoluteUrl(`/writing/${essay.slug}#article`))),
            newsletterSchema(),
          ]),
        }}
      />

      <Section divider={false} labelledBy="writing-heading">
        <SectionHeader
          id="writing-heading"
          label="WRITING"
          as="h1"
          size="display-lg"
          title="Thinking, worked out in public."
          titleMaxCh={22}
          leadMaxCh={62}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                Essays on software architecture, systems thinking, AI, engineering leadership, and
                the work of building products. Frameworks I actually use, and opinions I am willing
                to defend.
              </p>
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                Long-form and infrequent. New writing goes out through {NEWSLETTER.name} on
                Substack; this page is where it is indexed.
              </p>
            </>
          }
        />
      </Section>

      {/* WRITING.01 — live from the publication feed. Link-out only. */}
      <Section labelledBy="writing-newsletter-posts">
        <SectionHeader
          id="writing-newsletter-posts"
          label="WRITING.01"
          title={`Latest from ${NEWSLETTER.name}`}
          titleMaxCh={26}
          leadMaxCh={58}
          lead="Recent posts from the newsletter. Each one opens on Substack, where it is published."
        />
        <SubstackPosts posts={posts} />
      </Section>

      {/* WRITING.02 — essays written for this site. Canonical here. */}
      {essays.length > 0 && (
        <Section labelledBy="writing-essays">
          <SectionHeader
            id="writing-essays"
            label="WRITING.02"
            title="Essays"
            titleMaxCh={20}
            leadMaxCh={58}
            lead={
              <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
                Longer pieces written for this site. These live here rather than in the newsletter,
                and most of them started as a decision on a real system — the ones with a write-up
                are on{' '}
                <Link href="/projects" className="prose-link">
                  Projects
                </Link>
                .
              </p>
            }
          />

          {/* Pillar coverage across the local essays. Descriptive, not
           * interactive — see the note in the page docblock. */}
          <ul
            className="flex flex-wrap"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              marginTop: 'var(--space-7)',
              gap: 'var(--space-2) var(--space-3)',
            }}
          >
            {pillarCounts.map(({ pillar, label, count }) => (
              <li
                key={pillar}
                className="type-mono-label nums-tabular"
                style={{
                  color: count > 0 ? 'var(--color-text)' : 'var(--color-text-dim)',
                  paddingBlock: 'var(--space-2)',
                  paddingInline: 'var(--space-4)',
                  border: 'var(--stroke-hairline) solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {label} <span style={{ color: 'var(--color-text-dim)' }}>{count}</span>
              </li>
            ))}
          </ul>

          {lead && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <SectionLabel>Featured</SectionLabel>
              <h3
                className="type-display-md card-title"
                style={{ marginTop: 'var(--space-5)', maxWidth: '24ch' }}
              >
                <Link href={`/writing/${lead.slug}`} style={{ color: 'inherit' }}>
                  {lead.frontmatter.title}
                </Link>
              </h3>
              <p
                className="type-body-lg"
                style={{
                  marginTop: 'var(--space-5)',
                  color: 'var(--color-text-muted)',
                  maxWidth: '64ch',
                }}
              >
                {lead.frontmatter.excerpt}
              </p>
              <p
                className="type-mono-label nums-tabular"
                style={{ marginTop: 'var(--space-5)', color: 'var(--color-text-dim)' }}
              >
                {PILLAR_LABELS[lead.frontmatter.pillar]} ·{' '}
                <time dateTime={lead.frontmatter.publishedAt}>
                  {formatDate(lead.frontmatter.publishedAt)}
                </time>{' '}
                · {lead.readingMinutes} min read
              </p>
            </div>
          )}

          {rest.length > 0 && (
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                marginTop: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {rest.map((essay) => (
                <li
                  key={essay.slug}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_16rem]"
                  style={{
                    gap: 'var(--space-3) var(--space-7)',
                    paddingBlock: 'var(--space-6)',
                    borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                  }}
                >
                  <div>
                    <h3 className="type-h2 card-title" style={{ maxWidth: '28ch' }}>
                      <Link href={`/writing/${essay.slug}`} style={{ color: 'inherit' }}>
                        {essay.frontmatter.title}
                      </Link>
                    </h3>
                    <p
                      className="type-body"
                      style={{
                        marginTop: 'var(--space-3)',
                        color: 'var(--color-text-muted)',
                        maxWidth: '60ch',
                      }}
                    >
                      {essay.frontmatter.excerpt}
                    </p>
                  </div>

                  <p
                    className="type-mono-label nums-tabular"
                    style={{ color: 'var(--color-text-dim)', margin: 0 }}
                  >
                    {PILLAR_LABELS[essay.frontmatter.pillar]}
                    <br />
                    <time dateTime={essay.frontmatter.publishedAt}>
                      {formatDate(essay.frontmatter.publishedAt)}
                    </time>{' '}
                    · {essay.readingMinutes} min
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* WRITING.03 — the single subscribe surface. No local capture form:
       * Substack owns subscriber management, and a second list would have to
       * be reconciled with it forever. */}
      <Section labelledBy="writing-newsletter">
        <SectionHeader
          id="writing-newsletter"
          label="NEWSLETTER"
          title={NEWSLETTER.name}
          titleMaxCh={24}
          leadMaxCh={58}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
                Essays on architecture, engineering leadership, AI, and building better systems. No
                promotions, no cadence for its own sake.
              </p>
              {/* The one link from the writing to the work. A reader who has
               * got this far is either subscribing or recognising their own
               * problem in an essay; this is the second path, stated once. */}
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                If a piece here describes a problem you are actually living with, that is what the{' '}
                <Link href="/consulting" className="prose-link">
                  consulting work
                </Link>{' '}
                is for.
              </p>
            </>
          }
        />
        <div style={{ marginTop: 'var(--space-7)' }}>
          <Button href={SUBSTACK_URL} variant="primary">
            Read &amp; subscribe on Substack →
          </Button>
        </div>
      </Section>
    </main>
  );
}
