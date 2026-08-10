import { codeToHtml } from 'shiki';

/**
 * CodeBlock — Shiki syntax highlighting, executed at build time.
 *
 * This is an async Server Component, so the highlighter runs during static
 * generation and ships zero JavaScript. That's the whole reason to do it here
 * rather than with a client-side highlighter: the performance budget forbids
 * shipping a tokenizer to render text that never changes.
 *
 * Theme note: Shiki's built-in themes all carry their own background color,
 * which would fight the design system. `bg-transparent` on the wrapper plus an
 * explicit surface background keeps the block on our tokens while letting
 * Shiki own only the foreground colors.
 */

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export async function CodeBlock({ code, lang = 'text' }: CodeBlockProps) {
  const html = await codeToHtml(code.replace(/\n$/, ''), {
    lang,
    theme: 'github-dark-default',
    // Strip Shiki's inline background so the token surface shows through.
    colorReplacements: { '#0d1117': 'transparent' },
  });

  return (
    <div
      className="code-block"
      style={{
        marginBlock: 'var(--space-7)',
        padding: 'var(--space-5)',
        background: 'var(--color-surface)',
        border: 'var(--stroke-hairline) solid var(--color-border)',
        borderRadius: 'var(--radius-xs)',
        overflowX: 'auto',
      }}
      // Shiki output is generated at build time from repo-local MDX. It is not
      // user input, and Shiki escapes the code it embeds.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
