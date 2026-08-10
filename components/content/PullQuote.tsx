/**
 * PullQuote — the editorial break in a long article.
 *
 * Set in the display face at section-opener scale, with an oversized orange
 * quote mark in the margin per the brand spec. Not a <blockquote>: a pull
 * quote repeats text already present in the article, so marking it up as a
 * quotation would make screen readers read it twice. It is decorative
 * emphasis, and `aria-hidden` states that honestly.
 *
 * Available in MDX without an import (registered in MDXComponents).
 *
 * **The text container is a <div>, not a <p>, and that is load-bearing.**
 * MDX decides whether a component's children are inline text or block content
 * based on formatting — and `pnpm format` rewrites these files. Prettier turns
 * `<PullQuote>text</PullQuote>` into an indented multi-line block, which makes
 * MDX parse the children as a markdown paragraph. Those children then arrive
 * here already wrapped in a <p> from the `p` override. A <p> root would nest
 * <p> inside <p> — invalid HTML and a hydration error.
 *
 * Using a <div> plus `.pullquote-body` (globals.css) makes the component
 * correct whichever way MDX parses it, rather than depending on authors never
 * running the formatter.
 *
 * Server Component.
 */
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        marginBlock: 'var(--space-9)',
        paddingLeft: 'var(--space-7)',
        maxWidth: '30ch',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: '-0.15em',
          fontFamily: 'var(--font-serif)',
          fontSize: '3.5em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          userSelect: 'none',
        }}
      >
        &ldquo;
      </span>
      <div
        className="pullquote-body type-display-md"
        style={{ color: 'var(--color-text)', fontStyle: 'italic' }}
      >
        {children}
      </div>
    </div>
  );
}
