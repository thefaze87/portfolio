import { cn } from '@/lib/utils';

/**
 * EyebrowLabel — the mono-label treatment with leading orange divider.
 *
 * Always uses --font-mono at 11px, 0.14em tracking, uppercase. The
 * 24px (--space-5) divider is **always orange** regardless of text color
 * (per docs/brand-spec.md §5) — orange is the load-bearing brand cue,
 * not a function of the label's emphasis.
 *
 * Props:
 *   - `accent` (default true)  — label text in --color-accent; pass
 *     `false` for muted treatment in dense metadata contexts.
 *   - `divider` (default true) — set false in inline metadata strings
 *     or stacked secondary labels where the divider would clutter.
 *
 * Architecturally: the divider's orange color is hardcoded to the
 * accent token. It's not a configurable color — that would let the
 * caller produce off-brand variants. If you need a non-orange divider,
 * you don't need an EyebrowLabel.
 */

interface EyebrowLabelProps {
  children: React.ReactNode;
  accent?: boolean;
  divider?: boolean;
  className?: string;
}

export function EyebrowLabel({
  children,
  accent = true,
  divider = true,
  className,
}: EyebrowLabelProps) {
  const color = accent ? 'var(--color-accent)' : 'var(--color-text-muted)';

  return (
    <span
      className={cn('type-mono-label inline-flex items-center', className)}
      style={{ color, gap: 'var(--space-3)' }}
    >
      {divider && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 'var(--space-5)',
            height: 'var(--stroke-thin)',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
