import { cn } from '@/lib/utils';

/**
 * Logo — MF monogram, shared-stem geometric construction.
 *
 * The single most-referenced brand asset. Six line segments at a fixed
 * `0 0 120 140` viewBox; the **shared stem** (M right leg = F spine) is a
 * single <line> element, not two adjacent strokes. The M valley sits at
 * y=84 — below geometric center, giving the editorial proportion that
 * separates this from a generic monogram.
 *
 * Per docs/components/logo.md:
 *   - Six lines: M left stem, M left diagonal, M right diagonal,
 *     SHARED STEM, F top arm, F crossbar. All square-capped.
 *   - Optical stroke scaling: stroke width is *not* proportional to
 *     render size. Smaller sizes get heavier strokes (12 at size 16) so
 *     the mark stays legible; larger sizes get lighter strokes (2.5 at
 *     size 120) so it reads refined.
 *   - Three variants: default (var(--color-text)), accent (var(--color-accent)),
 *     framed (1px square border, 20% internal padding).
 *
 * Architecturally:
 *   - `size` is a literal union of the six designed sizes. Arbitrary
 *     numbers are a compile error — they would require runtime stroke
 *     interpolation we don't want consumers improvising.
 *   - `variant` is a literal union; there's no `color` prop. The accent
 *     swap goes through the CSS variable, never a hardcoded value.
 *   - Server Component. No client state.
 */

export type LogoSize = 16 | 24 | 32 | 48 | 72 | 120;
export type LogoVariant = 'default' | 'accent' | 'framed';

/** Optical stroke widths in viewBox units (viewBox is 120 wide). The
 *  table is intentionally non-linear: heavier at small sizes to preserve
 *  legibility, lighter at large sizes to feel refined. */
const STROKE_BY_SIZE: Record<LogoSize, number> = {
  16: 12,
  24: 9,
  32: 7,
  48: 5,
  72: 3.5,
  120: 2.5,
};

/** Aspect ratio = viewBox height / viewBox width = 140 / 120 = 7/6. */
const ASPECT_RATIO = 140 / 120;

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  'aria-label'?: string;
}

export function Logo({
  size = 32,
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Mark Fasel',
}: LogoProps) {
  const strokeWidth = STROKE_BY_SIZE[size];
  const height = Math.round(size * ASPECT_RATIO);
  const stroke = variant === 'accent' ? 'var(--color-accent)' : 'var(--color-text)';

  const mark = (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={cn(variant !== 'framed' && className)}
    >
      <title>{ariaLabel}</title>
      {/* 1 · M left stem */}
      <line
        x1="8"
        y1="14"
        x2="8"
        y2="126"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 2 · M left diagonal */}
      <line
        x1="8"
        y1="14"
        x2="56"
        y2="84"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 3 · M right diagonal */}
      <line
        x1="56"
        y1="84"
        x2="104"
        y2="14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 4 · SHARED STEM — M right leg = F spine (one line, not two) */}
      <line
        x1="104"
        y1="14"
        x2="104"
        y2="126"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 5 · F top arm */}
      <line
        x1="104"
        y1="14"
        x2="118"
        y2="14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 6 · F crossbar */}
      <line
        x1="104"
        y1="68"
        x2="116"
        y2="68"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );

  if (variant === 'framed') {
    const framePadding = Math.round(size * 0.2);
    const frameSize = size + framePadding * 2;
    return (
      <span
        className={cn('inline-flex items-center justify-center', className)}
        style={{
          width: frameSize,
          height: frameSize,
          borderColor: 'var(--color-text)',
          borderStyle: 'solid',
          borderWidth: 'var(--stroke-thin)',
        }}
      >
        {mark}
      </span>
    );
  }

  return mark;
}
