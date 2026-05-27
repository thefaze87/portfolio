import { cn } from '@/lib/utils';

/**
 * MARK FASEL wordmark — Cabinet Grotesk Medium, all caps, 0.14em tracking.
 *
 * Renders the canonical wordmark treatment. Optionally pairs with the
 * SOLUTIONS ARCHITECT · AI STRATEGIST metadata line beneath it (footer
 * lockup, formal communications).
 *
 * Per docs/brand-spec.md §3:
 *   - Cabinet Grotesk Medium (500), 0.14em letter-spacing, all caps.
 *   - Metadata: JetBrains Mono, sm size, 0.14em tracking, muted color.
 *
 * Three discrete sizes, not arbitrary px — keeps the wordmark consistent
 * across the site. If you find yourself wanting `size="xl"` for an
 * editorial hero, that's the `<h1>` font in the page composition, not a
 * wordmark. The wordmark is brand identity, not display text.
 */

export type WordmarkSize = 'sm' | 'md' | 'lg';

const FONT_SIZE_BY_SIZE: Record<WordmarkSize, number> = {
  sm: 14, // footer-dense use, paired with Logo size 24
  md: 18, // desktop header default, paired with Logo size 32
  lg: 28, // editorial / large-format lockup, paired with Logo size 48+
};

const META_GAP_BY_SIZE: Record<WordmarkSize, string> = {
  sm: 'var(--space-1)',
  md: 'var(--space-2)',
  lg: 'var(--space-3)',
};

interface WordmarkProps {
  size?: WordmarkSize;
  /** Renders the SOLUTIONS ARCHITECT · AI STRATEGIST metadata line beneath. */
  metadata?: boolean;
  className?: string;
}

export function Wordmark({ size = 'md', metadata = false, className }: WordmarkProps) {
  const fontSize = FONT_SIZE_BY_SIZE[size];
  const metaGap = META_GAP_BY_SIZE[size];

  return (
    <span className={cn('inline-flex flex-col', className)}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-text)',
          lineHeight: 1,
        }}
      >
        Mark Fasel
      </span>
      {metadata && (
        <span
          className="type-mono-label"
          style={{
            color: 'var(--color-text-muted)',
            marginTop: metaGap,
          }}
        >
          Solutions Architect · AI Strategist
        </span>
      )}
    </span>
  );
}
