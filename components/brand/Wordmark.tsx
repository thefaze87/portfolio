import { cn } from '@/lib/utils';

/**
 * Wordmark — "MARK FASEL" logotype.
 *
 * Cabinet Grotesk Medium 500, UPPERCASE, 0.16em tracking. Single weight —
 * no light/bold split, no title case (both explored and rejected). Always
 * sized smaller than the mark so the mark stays the hero.
 *
 * Server Component. Spec: docs/components/wordmark.md.
 */

export type WordmarkSize = 'sm' | 'md' | 'lg';
export type WordmarkVariant = 'default' | 'accent';

const SIZE_PX: Record<WordmarkSize, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

interface WordmarkProps {
  size?: WordmarkSize;
  variant?: WordmarkVariant;
  className?: string;
}

export function Wordmark({ size = 'md', variant = 'default', className }: WordmarkProps) {
  return (
    <span
      className={cn(className) || undefined}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: SIZE_PX[size],
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        lineHeight: 1,
        color: variant === 'accent' ? 'var(--color-accent)' : 'var(--color-text)',
        whiteSpace: 'nowrap',
      }}
    >
      Mark Fasel
    </span>
  );
}
