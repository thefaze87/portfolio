# `<Logo>` component spec

The single most-referenced brand asset. Build this once, correctly, and never touch it again.

## Construction

Geometric monoline construction at viewBox `0 0 120 140`. The right leg of the M and the spine of the F **share one stroke**. This is what makes the monogram read as a single unit.

```
viewBox: 0 0 120 140
M valley meets at y=84 (60% of cap height — gives editorial proportion)
Cap height: 112px (from y=14 to y=126)
Top padding: 14px, bottom padding: 14px
Left edge: x=8, right edge of F arm: x=118
```

### Strokes (six lines total, square-capped)

```
1. M left stem        (8, 14)   → (8, 126)
2. M left diagonal    (8, 14)   → (56, 84)
3. M right diagonal   (56, 84)  → (104, 14)
4. SHARED STEM        (104, 14) → (104, 126)   ← M right leg = F spine
5. F top arm          (104, 14) → (118, 14)
6. F crossbar         (104, 68) → (116, 68)
```

## Optical stroke scaling

The component must adjust stroke width based on render size. **Do not** SVG-scale a single asset — strokes get invisible at small sizes if you just shrink the SVG.

| `size` prop | Render width × height | Stroke width |
|---|---|---|
| `16` | 16 × 19 | 12 |
| `24` | 24 × 28 | 9 |
| `32` | 32 × 37 | 7 |
| `48` | 48 × 56 | 5 |
| `72` | 72 × 84 | 3.5 |
| `120` | 120 × 140 | 2.5 |

For sizes between these values, interpolate stroke width linearly. For sizes outside this range, clamp to the nearest defined value.

## Variants

- **`default`** — `stroke="var(--color-text)"` (paper white on dark backgrounds, dark text on light)
- **`accent`** — `stroke="var(--color-accent)"` (orange) — used for chapter markers, hover states, or when placed over photography that would clash with the default
- **`framed`** — wrapped in a 1px square border with internal padding equal to 20% of the box size

## React component

```tsx
// components/brand/Logo.tsx
import { cn } from '@/lib/utils';

type LogoSize = 16 | 24 | 32 | 48 | 72 | 120;
type LogoVariant = 'default' | 'accent' | 'framed';

const STROKE_BY_SIZE: Record<LogoSize, number> = {
  16: 12,
  24: 9,
  32: 7,
  48: 5,
  72: 3.5,
  120: 2.5,
};

const ASPECT_RATIO = 140 / 120; // height / width

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
      {/* M left stem */}
      <line x1="8" y1="14" x2="8" y2="126" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      {/* M left diagonal */}
      <line x1="8" y1="14" x2="56" y2="84" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      {/* M right diagonal */}
      <line x1="56" y1="84" x2="104" y2="14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      {/* Shared stem (M right leg = F spine) */}
      <line x1="104" y1="14" x2="104" y2="126" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      {/* F top arm */}
      <line x1="104" y1="14" x2="118" y2="14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
      {/* F crossbar */}
      <line x1="104" y1="68" x2="116" y2="68" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" />
    </svg>
  );

  if (variant === 'framed') {
    const framePadding = Math.round(size * 0.2);
    const frameSize = size + framePadding * 2;
    return (
      <div
        className={cn('inline-flex items-center justify-center border', className)}
        style={{
          width: frameSize,
          height: frameSize,
          borderColor: 'var(--color-text)',
          borderWidth: '1px',
        }}
      >
        {mark}
      </div>
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

| Where | Size | Variant |
|---|---|---|
| Favicon | 16 | default (no orange) |
| Browser tab icon | 32 | default |
| Header (mobile) | 32 | default |
| Header (desktop) | 32 | default |
| Footer | 80 (interpolated stroke ~3.0) | default |
| Case study chapter markers | 48 | accent |
| 404 page centerpiece | 120 | default |
| Social avatar | 120 → exported as PNG | framed |

## Styleguide entry

Add this section to `/styleguide`:

```tsx
<section>
  <EyebrowLabel>Brand · Logo</EyebrowLabel>
  <h2>MF monogram</h2>

  <div className="flex items-end gap-12 mt-8 p-8 border border-[var(--color-border)]">
    {[16, 24, 32, 48, 72, 120].map((s) => (
      <div key={s} className="text-center">
        <Logo size={s as LogoSize} />
        <div className="mt-4 text-xs font-mono text-[var(--color-text-dim)]">{s}PX</div>
      </div>
    ))}
  </div>

  <div className="grid grid-cols-3 gap-4 mt-8">
    <div className="p-8 border border-[var(--color-border)] flex items-center justify-center">
      <Logo size={72} variant="default" />
    </div>
    <div className="p-8 border border-[var(--color-border)] flex items-center justify-center">
      <Logo size={72} variant="accent" />
    </div>
    <div className="p-8 border border-[var(--color-border)] flex items-center justify-center">
      <Logo size={48} variant="framed" />
    </div>
  </div>
</section>
```

## Acceptance criteria

The component is correct when:

- [ ] At every defined size, the M valley clearly sits below center (60% of cap height)
- [ ] The shared stem reads as one continuous line, not two adjacent lines
- [ ] At 16px the mark is legible (no stroke vanishing)
- [ ] At 120px the strokes feel refined, not heavy
- [ ] `accent` variant flips to orange via the CSS variable, not a hardcoded color
- [ ] `framed` variant maintains correct proportions at all sizes
- [ ] No `'use client'` directive
- [ ] Component passes `pnpm typecheck` and `pnpm lint`
- [ ] Styleguide shows all six sizes + three variants
- [ ] Lighthouse accessibility on `/styleguide` = 100 with this component present
