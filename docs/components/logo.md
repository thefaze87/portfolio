# `<Logo>` component spec

The single most-referenced brand asset. Build this once, correctly, and never touch it again.

## Construction

Geometric monoline construction at viewBox `0 0 160 140`. **Tight-pair construction** — the M and F are adjacent peer letters separated by a 12-unit gap, sharing baseline, top edge, and stroke weight. They read as two letters in dialogue, not one fused glyph. (An earlier draft used a "shared stem" where the M's right leg doubled as the F's spine; it was abandoned because the F read as stubs hanging off the M rather than as a peer letter.)

```
viewBox: 0 0 160 140
M valley meets at y=84 (below geometric center — gives editorial proportion)
Cap height: 112px (from y=14 to y=126)
Top padding: 14px, bottom padding: 14px
Gap between M right stem (x=104) and F spine (x=116): 12 units
Left edge: x=8, right edge of F arm: x=148
```

### Strokes (seven lines total, square-capped)

```
1. M left stem        (8, 14)   → (8, 126)
2. M left diagonal    (8, 14)   → (56, 84)
3. M right diagonal   (56, 84)  → (104, 14)
4. M right stem       (104, 14) → (104, 126)
5. F spine            (116, 14) → (116, 126)   ← 12-unit gap from M right stem
6. F top arm          (116, 14) → (148, 14)    ← 32 units wide (~33% of M width)
7. F crossbar         (116, 76) → (142, 76)    ← 26 units (~81% of top arm), at optical center
```

Visual properties this construction must produce:

- M cap height equals F cap height (both y=14 → y=126)
- F top arm spans ~33% of the M's width — reads as a peer letter, not a stub
- F crossbar at y=76 (55% down the cap, optical center — not the geometric 50%)
- Crossbar ~19% shorter than the top arm — correct F proportion
- 12-unit gap between M and F — letters in dialogue, not glued together
- Both letters share baseline, top edge, and stroke weight

## Optical stroke scaling

The component must adjust stroke width based on render size. **Do not** SVG-scale a single asset — strokes get invisible at small sizes if you just shrink the SVG. `size` controls the rendered **width**; height derives from the 0.875 aspect ratio (the monogram is wider than it is tall).

| `size` prop | Render width × height | Stroke width |
| ----------- | --------------------- | ------------ |
| `16`        | 16 × 14               | 12           |
| `24`        | 24 × 21               | 9            |
| `32`        | 32 × 28               | 7            |
| `48`        | 48 × 42               | 5            |
| `72`        | 72 × 63               | 3.5          |
| `120`       | 120 × 105             | 2.5          |

For sizes between these values, interpolate stroke width linearly. For sizes outside this range, clamp to the nearest defined value. (In practice `size` is a literal union of these six values, so interpolation only matters if the union is ever widened.)

## Variants

- **`default`** — `stroke="var(--color-text)"` (paper white on dark backgrounds, dark text on light)
- **`accent`** — `stroke="var(--color-accent)"` (orange) — used for chapter markers, hover states, or when placed over photography that would clash with the default
- **`framed`** — wrapped in a 1px square border with internal padding equal to 20% of the box size

## React component

```tsx
// components/brand/Logo.tsx
import { cn } from '@/lib/utils';

export type LogoSize = 16 | 24 | 32 | 48 | 72 | 120;
export type LogoVariant = 'default' | 'accent' | 'framed';

const STROKE_BY_SIZE: Record<LogoSize, number> = {
  16: 12,
  24: 9,
  32: 7,
  48: 5,
  72: 3.5,
  120: 2.5,
};

const ASPECT_RATIO = 140 / 160; // height / width = 0.875

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
  // Collapse empty className to undefined so React omits class="" entirely.
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
      {/* 5 · F spine — 12-unit gap from M right stem */}
      <line
        x1="116"
        y1="14"
        x2="116"
        y2="126"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 6 · F top arm — 32 units wide */}
      <line
        x1="116"
        y1="14"
        x2="148"
        y2="14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      {/* 7 · F crossbar — 26 units, at y=76 */}
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
```

## Usage rules

1. **Server Component.** Do not add `'use client'`. The logo is static SVG.
2. **No props beyond `size`, `variant`, `className`, `aria-label`.** If you find yourself needing `color`, you're misusing it — use `variant` instead.
3. **Use `size`, not `className`, for sizing.** The optical stroke depends on it. Setting `w-8` via Tailwind defeats the system.
4. **`aria-label`:** default is `"Mark Fasel"`. Override only when context demands it (e.g., `aria-label="Back to home"` when the logo is the home link).
5. **Wordmark is separate.** This component renders the mark only. The `"MARK FASEL"` wordmark is a separate `<Wordmark>` component built in Cabinet Grotesk.

## Variants in use

| Where                      | Size                          | Variant             |
| -------------------------- | ----------------------------- | ------------------- |
| Favicon                    | 16                            | default (no orange) |
| Browser tab icon           | 32                            | default             |
| Header (mobile)            | 32                            | default             |
| Header (desktop)           | 32                            | default             |
| Footer                     | 80 (interpolated stroke ~3.0) | default             |
| Case study chapter markers | 48                            | accent              |
| 404 page centerpiece       | 120                           | default             |
| Social avatar              | 120 → exported as PNG         | framed              |

## Styleguide entry

`/styleguide` §10 shows all six sizes (default variant) plus the three variants at size 72. The section imports the component directly, so it tracks the implementation automatically.

## Acceptance criteria

The component is correct when:

- [ ] At every defined size, the M valley clearly sits below center (y=84)
- [ ] The 12-unit gap between M and F is perceptible — the two read as peer letters
- [ ] The F top arm spans ~33% of the M's width (not a stub)
- [ ] The F crossbar sits at optical center (y=76), ~19% shorter than the top arm
- [ ] At 16px the mark is legible (no stroke vanishing)
- [ ] At 120px the strokes feel refined, not heavy
- [ ] `accent` variant flips to orange via the CSS variable, not a hardcoded color
- [ ] `framed` variant maintains correct proportions at all sizes
- [ ] No `'use client'` directive
- [ ] No empty `class=""` attribute emitted when `className` is undefined
- [ ] Component passes `pnpm typecheck` and `pnpm lint`
- [ ] Styleguide shows all six sizes + three variants
- [ ] Lighthouse accessibility on `/styleguide` = 100 with this component present
