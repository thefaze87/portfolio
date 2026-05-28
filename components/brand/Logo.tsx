import { cn } from '@/lib/utils';

/**
 * Logo — MF monogram, tight-pair construction.
 *
 * The M and F are adjacent peer letters separated by a 12-unit gap — not a
 * shared stem. They share baseline, top edge, and stroke weight, reading as
 * two letters in dialogue rather than one fused glyph. Seven line segments
 * at a fixed `0 0 160 140` viewBox; the M valley sits at y=84 (below
 * geometric center) for editorial proportion, and the F's top arm spans ~33%
 * of the M's width so the F reads as a full letter, not a stub.
 *
 * Per docs/components/logo.md:
 *   - Seven lines: M left stem, M left diagonal, M right diagonal, M right
 *     stem, F spine, F top arm, F crossbar. All square-capped.
 *   - 12-unit gap between the M right stem (x=104) and the F spine (x=116).
 *   - F crossbar at y=76 (55% down the cap — optical center).
 *   - Optical stroke scaling: stroke width is *not* proportional to render
 *     size. Smaller sizes get heavier strokes (12 at size 16) so the mark
 *     stays legible; larger sizes get lighter strokes (2.5 at size 120) so
 *     it reads refined.
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

/** Optical stroke widths in viewBox units (viewBox is 160 wide). The
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

/** Aspect ratio = viewBox height / viewBox width = 140 / 160 = 0.875.
 *  The monogram is wider than it is tall (M + gap + F). `size` controls
 *  width; height derives from it. */
const ASPECT_RATIO = 140 / 160;

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
  // The framed variant carries className on its wrapper, so the mark itself
  // takes none. Collapse the empty string to undefined so React omits the
  // attribute entirely rather than emitting class="".
  const markClassName = variant === 'framed' ? undefined : cn(className) || undefined;

  const mark = (
    <svg
      width={size}
      height={height}
      viewBox="0 0 160 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={markClassName}
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
      {/* 4 · M right stem */}
      <line
        x1="104"
        y1="14"
        x2="104"
        y2="126"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 5 · F spine — 12-unit gap from the M right stem */}
      <line
        x1="116"
        y1="14"
        x2="116"
        y2="126"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 6 · F top arm — 32 units wide (~33% of M width) */}
      <line
        x1="116"
        y1="14"
        x2="148"
        y2="14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 7 · F crossbar — 26 units (~81% of top arm), at y=76 optical center */}
      <line
        x1="116"
        y1="76"
        x2="142"
        y2="76"
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
