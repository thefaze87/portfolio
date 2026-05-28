# `<Wordmark>` component spec — Mark Fasel

The typographic counterpart to the mark. Renders "MARK FASEL" as a logotype.

## Locked treatment

- **Font:** Cabinet Grotesk, weight **500 (Medium)**
- **Case:** UPPERCASE (`text-transform: uppercase`)
- **Tracking:** `letter-spacing: 0.16em`
- **Color:** `var(--color-text)` default; `var(--color-accent)` for accent contexts
- **Line height:** 1 (single line) for horizontal; 0.98 for stacked

No weight split (we explored "Mark" light + "Fasel" bold and rejected it). Single medium weight, uppercase, balanced tracking. This is the final treatment — do not reintroduce mixed weights or title case.

## Why these values

Medium 500 sits between the delicacy of Regular and the heaviness of Bold — confident without competing with the mark. Uppercase reads as a logotype rather than running text. 0.16em tracking gives it editorial air without spreading so wide it loses cohesion. The wordmark is always sized **smaller than the mark is tall** so the mark stays the hero.

## React component

```tsx
// components/brand/Wordmark.tsx
import { cn } from '@/lib/utils';

type WordmarkSize = 'sm' | 'md' | 'lg';
type WordmarkVariant = 'default' | 'accent';

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
      className={cn(className)}
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
```

(`var(--font-display)` resolves to Cabinet Grotesk per tokens.css.)

## Lockups

### Horizontal lockup (mark + wordmark side by side)

Used in: footer, formal lockup contexts, email signatures.

- `<Logo height={H}>` on the left
- `<Wordmark>` on the right, vertically centered to the mark's optical center
- Gap between them ≈ `H * 0.35`
- The wordmark's cap height should align roughly to the mark's vertical center, NOT its full height (the mark is taller than the cap height of the text)

```tsx
<div className="flex items-center" style={{ gap: 'calc(var(--logo-h) * 0.35)' }}>
  <Logo height={40} />
  <Wordmark size="lg" />
</div>
```

### Full lockup with role (footer / contact)

Mark + wordmark, with the mono role line beneath:

```
[mark]  MARK FASEL
        SOLUTIONS ARCHITECT · AI STRATEGIST   (JetBrains Mono, 9-11px, 0.18em, --color-text-dim)
```

The role line aligns to the wordmark's left edge (indented past the mark).

## Placement rules — where mark vs wordmark vs lockup appears

| Context                             | What appears                                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Header (desktop + mobile)**       | **Mark only** (Logo height 28-32). No wordmark — keeps the header clean; the name lives elsewhere. |
| **Footer**                          | **Full lockup** — mark + wordmark + role line                                                      |
| **Email signature**                 | Horizontal lockup (mark + wordmark)                                                                |
| **Social avatar (LinkedIn/GitHub)** | **Mark only**, square asset (`mark-avatar-square.svg`)                                             |
| **Favicon / browser tab**           | **Mark only**                                                                                      |
| **Keynote footer**                  | Horizontal lockup, small                                                                           |
| **OG / social share images**        | Mark + wordmark, generous scale                                                                    |

This is deliberate: the mark earns standalone recognition in tight/square spaces; the full name appears where there's room and where identity needs spelling out.

## Acceptance criteria

- [ ] Cabinet Grotesk Medium 500, uppercase, 0.16em — exactly
- [ ] No mixed weights, no title case
- [ ] `sm`/`md`/`lg` sizes; `default`/`accent` variants
- [ ] Server Component, no `'use client'`
- [ ] Horizontal lockup aligns wordmark to mark's optical center with correct gap
- [ ] Header renders mark ONLY (no wordmark)
- [ ] Footer renders full lockup with role line
- [ ] Styleguide shows: wordmark alone (all sizes), horizontal lockup, full footer lockup
