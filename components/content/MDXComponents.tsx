import Link from 'next/link';
import { isValidElement, type ReactNode } from 'react';
import { CodeBlock } from '@/components/content/CodeBlock';
import { Callout } from '@/components/content/Callout';
import { PullQuote } from '@/components/content/PullQuote';

/**
 * Element overrides for MDX content.
 *
 * There is no Tailwind Typography plugin here on purpose — `prose` classes
 * bring their own type scale and color ramp, which would immediately diverge
 * from styles/tokens.css. Every element below resolves to a project token, so
 * article typography and page typography cannot drift apart.
 *
 * Headings get ids from rehype-slug, which is what makes in-page anchors and
 * a future table of contents work.
 */

/** Pull the raw text and language out of MDX's <pre><code class="language-x">. */
function extractCode(children: ReactNode): { code: string; lang: string } {
  if (isValidElement<{ children?: ReactNode; className?: string }>(children)) {
    const { children: inner, className } = children.props;
    const lang = /language-([\w-]+)/.exec(className ?? '')?.[1] ?? 'text';
    return { code: typeof inner === 'string' ? inner : '', lang };
  }
  return { code: typeof children === 'string' ? children : '', lang: 'text' };
}

const MEASURE = '68ch';

export const mdxComponents = {
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2
      {...props}
      className="type-display-md"
      style={{ marginTop: 'var(--space-9)', marginBottom: 'var(--space-5)', maxWidth: '24ch' }}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3
      {...props}
      className="type-h2"
      style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', maxWidth: '30ch' }}
    >
      {children}
    </h3>
  ),

  h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4
      {...props}
      className="type-h3"
      style={{ marginTop: 'var(--space-7)', marginBottom: 'var(--space-3)' }}
    >
      {children}
    </h4>
  ),

  /**
   * Styling lives in `.prose-p` rather than inline, so containers that receive
   * MDX paragraphs as children (PullQuote, Callout) can override them with
   * ordinary CSS specificity. Inline styles would win over any class and force
   * `!important` at every call site.
   */
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className="type-body-lg prose-p" />
  ),

  /** Internal links route through next/link; external links get the new-tab
   *  treatment and the screen-reader cue automatically. */
  a: ({ href = '', children, ...rest }: React.ComponentPropsWithoutRef<'a'>) => {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className="prose-link">
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className="prose-link">
        {children}
      </Link>
    );
  },

  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
      {...props}
      className="prose-list"
      style={{ marginBlock: 'var(--space-5)', maxWidth: MEASURE }}
    />
  ),

  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol
      {...props}
      className="prose-list prose-list--ordered"
      style={{ marginBlock: 'var(--space-5)', maxWidth: MEASURE }}
    />
  ),

  li: (props: React.ComponentPropsWithoutRef<'li'>) => (
    <li {...props} className="type-body-lg" style={{ color: 'var(--color-text-muted)' }} />
  ),

  strong: (props: React.ComponentPropsWithoutRef<'strong'>) => (
    <strong {...props} style={{ color: 'var(--color-text)', fontWeight: 600 }} />
  ),

  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...props}
      className="type-body-lg"
      style={{
        margin: 0,
        marginBlock: 'var(--space-7)',
        paddingLeft: 'var(--space-5)',
        borderLeft: 'var(--stroke-thick) solid var(--color-accent)',
        color: 'var(--color-text)',
        maxWidth: MEASURE,
      }}
    />
  ),

  hr: () => (
    <hr
      style={{
        marginBlock: 'var(--space-9)',
        border: 0,
        borderTop: 'var(--stroke-hairline) solid var(--color-border)',
      }}
    />
  ),

  /** Inline code. Fenced blocks are intercepted by `pre` below, so anything
   *  reaching here is inline. */
  code: (props: React.ComponentPropsWithoutRef<'code'>) => (
    <code
      {...props}
      className="type-mono-body"
      style={{
        color: 'var(--color-accent)',
        background: 'var(--color-surface)',
        padding: '0.1em 0.35em',
        borderRadius: 'var(--radius-xs)',
      }}
    />
  ),

  pre: ({ children }: React.ComponentPropsWithoutRef<'pre'>) => {
    const { code, lang } = extractCode(children);
    return <CodeBlock code={code} lang={lang} />;
  },

  /** Custom components available inside MDX without an import. */
  Callout,
  PullQuote,
};
