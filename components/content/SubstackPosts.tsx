import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/mdx';
import { NEWSLETTER } from '@/lib/nav';
import { SUBSTACK_URL, type SubstackPost } from '@/lib/substack';

/**
 * SubstackPosts — the newsletter's recent posts, rendered as link-out rows.
 *
 * Reuses the row geometry of the /writing archive list deliberately: a reader
 * scanning the page should see one consistent treatment for "a thing to read",
 * whether it lives here or on Substack. The only visual difference is the
 * "Read on Substack →" affordance, which is the one thing that genuinely
 * differs — the destination.
 *
 * ## Never renders a full article
 *
 * `excerpt` is one short paragraph lifted from the feed by lib/substack.ts.
 * The body stays on Substack, which is where its canonical URL points; this
 * component links there and nowhere else.
 *
 * ## Empty is a supported state, not an error
 *
 * `posts` is empty whenever the feed is unreachable, times out, or returns
 * nothing usable — all of which lib/substack.ts resolves to `[]` rather than
 * throwing. The fallback names the publication and links to it, so the section
 * still does its job with zero data and the visitor never learns a fetch
 * failed.
 *
 * Server Component.
 */

export interface SubstackPostsProps {
  posts: readonly SubstackPost[];
}

export function SubstackPosts({ posts }: SubstackPostsProps) {
  if (posts.length === 0) {
    return (
      <div style={{ marginTop: 'var(--space-7)' }}>
        <p className="type-body-lg" style={{ color: 'var(--color-text-muted)', maxWidth: '54ch' }}>
          Latest writing is available on {NEWSLETTER.name}.
        </p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button href={SUBSTACK_URL} variant="ghost">
            Visit the newsletter →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        marginTop: 'var(--space-7)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {posts.map((post) => (
        <li
          key={post.guid}
          className="grid grid-cols-1 lg:grid-cols-[1fr_16rem]"
          style={{
            gap: 'var(--space-3) var(--space-7)',
            paddingBlock: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          }}
        >
          <div>
            {/* The title is the primary link, so the whole row has one
             * unambiguous destination. `card-title` gives it the same hover
             * treatment as an internal essay title. */}
            <h3 className="type-h2 card-title" style={{ maxWidth: '28ch' }}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit' }}
              >
                {post.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </h3>

            <p
              className="type-body"
              style={{
                marginTop: 'var(--space-3)',
                color: 'var(--color-text-muted)',
                maxWidth: '60ch',
              }}
            >
              {post.excerpt}
            </p>

            <p style={{ marginTop: 'var(--space-4)' }}>
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="cta-text">
                Read on Substack →<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <p
            className="type-mono-label nums-tabular"
            style={{ color: 'var(--color-text-dim)', margin: 0 }}
          >
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
