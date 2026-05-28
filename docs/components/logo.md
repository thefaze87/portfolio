# `<Logo>` component spec — Mark Fasel mark

The brand mark. Replaces the prior MF-monogram experiments entirely. This is the final, locked geometry — sourced from the designer's own SVG, not a reconstruction.

## What the mark is

Three forms: two flowing ribbon slashes (the "M" / motion) and a solid triangular peak (elevation / the implied F). Strong diagonal motion, ascending left-to-right. Reads as an abstract systems/elevation symbol first, letters second.

The artwork is a single compound path at a `0 0 1500 1500` coordinate space. The actual artwork bounds are approximately x: 0–1500, y: 205–1277 — i.e. it is **landscape**, roughly 1.4:1 (wider than tall). The production component uses a tightened viewBox of `0 195 1500 1092` so the mark isn't floating in vertical whitespace.

## The path data (authoritative — do not redraw)

Single compound path, two subpaths (ribbons+left form, then the peak):

```
M 1431.320312 334.273438 L 1499.753906 388.058594 C 1434.921875 384.824219 1383.730469 408.207031 1346.671875 435.585938 C 1310.773438 462.113281 1282.113281 497.1875 1262.578125 537.328125 L 993.894531 1088.578125 C 937.699219 1203.902344 820.636719 1276.855469 692.339844 1276.855469 L 524.601562 1276.855469 L 932.050781 447.734375 C 942.796875 425.878906 955.554688 406.039062 969.964844 387.847656 C 907.601562 386.074219 858.148438 408.9375 822.070312 435.554688 C 786.171875 462.082031 757.507812 497.15625 737.972656 537.296875 L 469.292969 1088.546875 C 413.09375 1203.871094 296.03125 1276.824219 167.734375 1276.824219 L 0 1276.824219 L 407.449219 447.765625 C 499.847656 259.703125 742.03125 204.757812 906.746094 334.273438 L 971.886719 385.496094 C 1082.050781 249.261719 1286.597656 220.476562 1431.320312 334.273438 Z M 1217.828125 924.933594 L 1040.507812 1277.070312 L 1499.878906 1277.191406 L 1316.027344 924.230469 C 1295.269531 884.367188 1238.066406 884.761719 1217.828125 924.933594 Z
```

The peak subpath (for the two-tone variant) is the part after the first `Z`:

```
M 1217.828125 924.933594 L 1040.507812 1277.070312 L 1499.878906 1277.191406 L 1316.027344 924.230469 C 1295.269531 884.367188 1238.066406 884.761719 1217.828125 924.933594 Z
```

## Color system

The mark is driven by `currentColor` so a single path serves every colorway via CSS:

- **default** — `color: var(--color-text)` → white `#F5F2EB` (primary, on dark)
- **dark** — `color: #0A0A0A` (primary, on light)
- **accent** — `color: var(--color-accent)` → orange `#FF6B35`

Three solid monochrome colorways. No two-tone / split-fill variant.

There is NO "framed" variant for this mark (that was a monogram-era idea). Drop it.

## Sizing

Unlike the old monogram, this mark scales cleanly as a single asset (no optical stroke table needed — it's filled shapes, not strokes). The component takes a `height` in px and derives width from the 1.4:1 aspect ratio.

Aspect ratio: viewBox is 1500 wide × 1092 tall = **1.374 (width/height)**.

So: `width = height * 1.374`.

Recommended render heights:

- Favicon: 16, 32
- Header (mobile): 28
- Header (desktop): 32
- Footer: 56
- Hero / large: 80–120

## React component

```tsx
// components/brand/Logo.tsx
import { cn } from '@/lib/utils';

const ICON_PATH =
  'M 1431.320312 334.273438 L 1499.753906 388.058594 C 1434.921875 384.824219 1383.730469 408.207031 1346.671875 435.585938 C 1310.773438 462.113281 1282.113281 497.1875 1262.578125 537.328125 L 993.894531 1088.578125 C 937.699219 1203.902344 820.636719 1276.855469 692.339844 1276.855469 L 524.601562 1276.855469 L 932.050781 447.734375 C 942.796875 425.878906 955.554688 406.039062 969.964844 387.847656 C 907.601562 386.074219 858.148438 408.9375 822.070312 435.554688 C 786.171875 462.082031 757.507812 497.15625 737.972656 537.296875 L 469.292969 1088.546875 C 413.09375 1203.871094 296.03125 1276.824219 167.734375 1276.824219 L 0 1276.824219 L 407.449219 447.765625 C 499.847656 259.703125 742.03125 204.757812 906.746094 334.273438 L 971.886719 385.496094 C 1082.050781 249.261719 1286.597656 220.476562 1431.320312 334.273438 Z M 1217.828125 924.933594 L 1040.507812 1277.070312 L 1499.878906 1277.191406 L 1316.027344 924.230469 C 1295.269531 884.367188 1238.066406 884.761719 1217.828125 924.933594 Z';

const ASPECT = 1500 / 1092; // ≈ 1.374 (width / height)

type LogoVariant = 'default' | 'dark' | 'accent';

interface LogoProps {
  height?: number;
  variant?: LogoVariant;
  className?: string;
  'aria-label'?: string;
}

export function Logo({
  height = 32,
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Mark Fasel',
}: LogoProps) {
  const width = Math.round(height * ASPECT);

  // currentColor-driven color, set via inline style on the svg
  const colorStyle =
    variant === 'accent'
      ? { color: 'var(--color-accent)' } // #FF6B35
      : variant === 'dark'
        ? { color: '#0A0A0A' }
        : { color: 'var(--color-text)' }; // #F5F2EB white

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 195 1500 1092"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      style={colorStyle}
      className={className}
    >
      <title>{ariaLabel}</title>
      <path fill="currentColor" d={ICON_PATH} />
    </svg>
  );
}
```

## Usage rules

1. **Server Component.** No `'use client'`. It's static SVG.
2. **Use `height`, not `className`, for sizing.** Width derives automatically from the aspect ratio.
3. **`variant` controls color.** Never hardcode a fill on a call site.
4. **The mark is landscape (1.37:1).** In square contexts (favicon, avatar), use the dedicated square asset (`/public/brand/mark-avatar-square.svg`), not the inline component.

## Wordmark

The `<Wordmark>` component renders "Mark Fasel" in Cabinet Grotesk (weight 600, letter-spacing -0.015em). The horizontal lockup places `<Logo height={X}>` to the left of the wordmark with a gap of roughly `height * 0.3`.

## Application assets (in /public/brand/)

- `mark-icon.svg` — currentColor, tight viewBox, for general use
- `mark-avatar-square.svg` — centered in a dark 1500² square, for LinkedIn/GitHub
- `favicon.svg` — same as mark-icon but white fill hardcoded, for the browser tab
- `favicon.ico` / `apple-touch-icon.png` — generated from the square avatar

## Acceptance criteria

- [ ] Renders the exact path from the designer's SVG (no redraw, no approximation)
- [ ] `default` (white) / `dark` (black) / `accent` (orange #FF6B35) variants all correct
- [ ] currentColor drives all three variants from a single path
- [ ] Width derives from height at 1.374 ratio
- [ ] Legible at height=16 (favicon)
- [ ] Server Component, no `'use client'`
- [ ] Passes typecheck + lint
- [ ] Styleguide §10 shows all four variants + the size range + the square avatar
- [ ] The old monogram construction (shared-stem / tight-pair) is fully removed from the component and this doc

## Favicon & app icons

Browser tabs vary (light-grey in light mode, dark in dark mode), so a single
white or black favicon disappears half the time. Solution:

- **favicon.svg** — the mark in **orange #FF6B35**, centered in a square viewBox.
  Orange has contrast against both light and dark tab bars and never vanishes.
  It's on-brand and makes the tab instantly recognizable. This is the primary
  browser favicon.
- **apple-touch-icon.png** — white mark on the dark square (rendered from
  mark-avatar-square.svg at 180×180). Home-screen icons sit on their own
  background, so white-on-dark is correct there.

An optional `favicon-adaptive.svg` (white↔black auto-flip via prefers-color-scheme)
is provided as an alternative, but the orange favicon is the recommended default.

### Wiring in app/layout.tsx metadata

```tsx
export const metadata: Metadata = {
  // ...
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};
```

Place favicon.svg in /public/. Generate apple-touch-icon.png (180×180) from
mark-avatar-square.svg and place in /public/.
