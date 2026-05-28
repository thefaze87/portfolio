# Mark Fasel — Personal brand site

Personal brand and consulting site for **Mark Fasel**, Solutions Architect & AI Strategist. This is the canonical context file for Claude Code. Read this before every task.

> **The single most important rule:** This is not a designer portfolio, freelancer portfolio, architecture firm site, or SaaS landing page. It is the digital headquarters of a working solutions architect with 20+ years of experience. When in doubt, choose the option that reads as a _publication_ rather than a _product_.

---

## Stack (locked)

- **Framework:** Next.js 15 (App Router, React 19, Server Components by default)
- **Language:** TypeScript 5.5+, strict mode, `noUncheckedIndexedAccess: true`
- **Styling:** Tailwind v4 with CSS-first config via `@theme` directive in `styles/tokens.css`. No `tailwind.config.ts` for tokens — use `@theme`.
- **UI primitives:** shadcn/ui, selectively (Button, Input, Textarea, Dialog, Sheet, Form). Restyle to match the design system. Never use shadcn as-is.
- **Animation:** Motion (formerly Framer Motion) v11+. Use sparingly. Honor `prefers-reduced-motion`.
- **Content:** MDX via `next-mdx-remote/rsc` with frontmatter validated by Zod.
- **Forms:** `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
- **Database:** Supabase (newsletter subscribers, contact submissions).
- **Email:** Resend (newsletter + transactional).
- **Analytics:** PostHog. Lazy-loaded after interactive.
- **Hosting:** Vercel.
- **Package manager:** pnpm. Never run `npm install` or `yarn`.
- **Node:** 22+. Pinned in `.nvmrc`.

If you need a library that isn't listed here, stop and ask before installing.

---

## File and directory conventions

```
app/
  (marketing)/              Marketing pages (home, about, consulting, etc.)
  (content)/                Content-driven pages (writing, work, case studies)
  (system)/                 Utility pages (now, uses, colophon, 404, styleguide)
  api/                      Route handlers
  llms.txt/route.ts         AI-readable site summary
  llms-full.txt/route.ts
  rss.xml/route.ts
  sitemap.ts
  robots.ts
  layout.tsx
  globals.css

components/
  ui/                       shadcn primitives (restyled)
  brand/                    Logo, EyebrowLabel, GridOverlay, Submark
  diagrams/                 TopologyHero, SystemDiagram, CriticalPath, Sparkline
  content/                  MDXComponents, PullQuote, CodeBlock, Callout, ArticleHeader
  marketing/                Hero, TrustBar, ServiceGrid, CaseStudyCard, etc.
  navigation/               Header, MobileDrawer, ReadingProgress, Footer

content/
  essays/*.mdx
  case-studies/*.mdx
  experience/timeline.json
  consulting/services.json

lib/                        mdx.ts, seo.ts, analytics.ts, newsletter.ts, etc.
styles/tokens.css           Tailwind v4 @theme tokens — single source of truth
public/fonts/               Self-hosted woff2 files
docs/                       Brand spec, component specs, ADRs
```

**Rules:**

- Server Components by default. Add `'use client'` only when you actually need client interactivity (state, effects, event handlers). The homepage hero is a Server Component with a client-island diagram, not a client component.
- Co-locate component-specific types in the component file. Shared types go in `lib/types.ts`.
- Every component file exports a named component matching the filename. No default exports except for Next.js page/layout files.
- Imports order: react/next → third-party → `@/` aliases → relative. No relative imports across feature boundaries — use `@/`.

---

## Design tokens — the single source of truth

All tokens live in `styles/tokens.css` under Tailwind v4's `@theme` directive. **Never hardcode a color, spacing value, font-family, or radius in component code.** If you find yourself typing `#FF6B35` or `padding: 24px` in JSX, stop and use the token.

### Color (dark mode is canonical)

```
--color-bg:               #0A0A0A
--color-surface:          #121212
--color-elevated:         #1B1B1B
--color-border:           #2A2A2A
--color-border-strong:    #3A3A3A
--color-text:             #F5F2EB
--color-text-muted:       #ACA79E
--color-text-dim:         #6B6760
--color-accent:           #FF6B35
--color-accent-secondary: #F5B041
```

### Orange rules (load-bearing)

Orange is a **signal color**, not a decoration. Treat it like a status indicator.

1. Maximum **one orange interactive element per viewport**. Two orange buttons compete.
2. Orange in body text only marks the term being defined or the critical takeaway. Never emphasis-as-decoration.
3. Orange in diagrams marks the _critical path_ — the thing the reader should look at first.
4. No orange-on-orange. No gradients of orange.
5. Hover states intensify to `#FF7E4F` or add a 1px underline. They do not switch colors.

### Spacing (4px base)

`space-1` through `space-11` (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192px). Use these tokens. Don't invent intermediate values.

### Radius

```
--radius-xs: 2px    buttons, badges, code blocks (intentionally sharp)
--radius-sm: 4px    cards, inputs
--radius-md: 8px    large cards, modals
--radius-lg: 12px   featured content blocks
--radius-full: 9999px  avatars only
```

The site leans **sharper** than modern conventions. 2px buttons signal precision. 12px-everywhere signals "designed in 2023." If you reach for `rounded-xl`, you're probably wrong.

### Typography

```
--font-display: "Cabinet Grotesk", system-ui, sans-serif    (display headings)
--font-serif:   "Fraunces", Georgia, serif                  (hero h1 ONLY)
--font-sans:    "Inter", system-ui, sans-serif              (body)
--font-mono:    "JetBrains Mono", ui-monospace, monospace   (labels, code)
```

The homepage hero `<h1>` uses Fraunces. Everything else display uses Cabinet Grotesk. **Maximum two font families on screen at once.** Display + body, or body + mono. Never three.

### Strokes (for borders and diagrams)

```
0.5px hairline       grid lines, technical drawings, default dividers
1px thin             standard borders
1.5px medium         diagram arrows, emphasis borders
2px thick            active states, focus rings only
```

### No shadows

This design system has no shadows. Visual depth comes from background layering (`bg → surface → elevated`), 0.5px borders at varying opacities, and negative space. **The single exception** is focus rings: `box-shadow: 0 0 0 2px var(--color-accent)`.

---

## What this site must NOT look like

Reject any output that drifts toward these aesthetics. If a piece of UI you're about to generate would feel at home in one of these categories, reconsider.

- ❌ Designer portfolio (Awwwards 2023 vibe, big arty imagery, animated cursors)
- ❌ Freelancer portfolio (testimonials carousel, "available for projects" pulse dot)
- ❌ Architecture firm (huge building photo with white text overlay)
- ❌ SaaS landing page (3-column features grid with stock icons, "Trusted by 10,000+ teams")
- ❌ Personal blog (default Tailwind prose, generic dark theme)
- ❌ Crypto/AI startup (gradients everywhere, glassmorphism, particle backgrounds)

What this site **does** look like:

- ✅ A technical publication run by one person
- ✅ A consultancy that doesn't need to advertise
- ✅ A working portfolio of _systems thinking_, not "projects"
- ✅ Editorial in tone — large serif headlines, generous whitespace, mono labels

---

## Imagery diet (proportions matter)

The visual mix is enforced. Don't reach for stock photography.

| Type                                          | %   | Where                                                        |
| --------------------------------------------- | --- | ------------------------------------------------------------ |
| Custom technical diagrams (SVG, drawn by us)  | 60% | Hero, case studies, services, writing headers                |
| Editorial typography as visual element        | 20% | Section openers, pull quotes, manifesto blocks               |
| Architectural photography                     | 15% | About page hero, one case study cover, writing pillar header |
| Code-as-typography (oversized JetBrains Mono) | 5%  | One accent moment per major page                             |

**No stock photography of any kind, ever.** No hands-on-keyboards, no diverse-team-laughing, no smiling-at-laptop. If a section needs a visual and a diagram won't work, leave it blank with strong typography.

---

## Logo system

The brand mark is the **Mark Fasel mark** — a designer-built SVG of two flowing
ribbon slashes plus a solid elevation peak. It reads as an abstract
systems/elevation symbol first, letters second. It is NOT a letterform monogram.
All prior monogram exploration (MF shared-stem, tight-pair, optical stroke tables)
is dead — ignore any reference to it anywhere.

The mark is a single compound SVG path on a 0 0 1500 1500 coordinate space, with a
production viewBox of `0 195 1500 1092` (the artwork is landscape, ~1.374:1).
Full path data and the React component live in `docs/components/logo.md` — that file
is authoritative.

Color: the mark is driven by `currentColor` so one path serves every colorway:

- default → var(--color-text) (paper white on dark)
- accent → var(--color-accent) (orange #FF6B35)
- dark → #0A0A0A (light-mode contexts)

Sizing: filled shapes, no optical stroke table. Component takes `height` (px),
derives width at 1.374 ratio.

**Wordmark:** "MARK FASEL" in Cabinet Grotesk Medium 500, UPPERCASE, letter-spacing
0.16em, sized smaller than the mark. Single weight — no light/bold split, no title
case. Spec in `docs/components/wordmark.md`.

**Placement:** Header shows the MARK ONLY (no wordmark). Footer shows the full
lockup (mark + wordmark + mono role line "SOLUTIONS ARCHITECT · AI STRATEGIST").
Square contexts (favicon, avatar) use the mark only via the square asset.

Brand SVG assets live in /public/brand/:

- mark-icon.svg (currentColor)
- mark-avatar-square.svg

---

## Tone of voice (writing filter)

When generating any copy (button labels, headings, alt text, MDX content):

- **Declarative, not promotional.** "I design enterprise systems." Not "passionate about crafting solutions."
- **Specific, not adjectival.** Numbers beat adjectives. "Reduced MTTR from 4h to 22min" beats "improved reliability."
- **Confident, not loud.** No exclamation points. No "Let's build something amazing." Architects don't beg.
- **First-person singular.** "I led." Not "we delivered."

Button label examples that pass: `See the work →`, `Read the thinking`, `Start a conversation`, `Let's talk`.
Button label examples that fail: `Get started!`, `Learn more`, `Click here`, `Contact us today`.

---

## Component contract: styleguide-first

Every component must be added to `/styleguide` before being used on a page. This is non-negotiable. The styleguide is the contract that prevents the homepage from drifting away from the inner pages.

When asked to build a component:

1. Build the component in `components/<category>/<Name>.tsx`
2. Add an entry to `app/(system)/styleguide/page.tsx` showing it in every variant
3. Only then use it on the actual page

The styleguide route is `noindex`'d and not linked from the public site.

---

## Performance & accessibility budget

Non-negotiable targets:

- Lighthouse Performance ≥ 98
- Lighthouse Accessibility 100
- Lighthouse Best Practices 100
- Lighthouse SEO 100
- LCP ≤ 1.2s, INP ≤ 100ms, CLS ≤ 0.02

How to hit them:

- Server Components everywhere by default
- All static routes pre-rendered (SSG)
- Fonts self-hosted woff2 with `font-display: swap`, preload only critical-path weights
- Diagrams as inline SVG (no image requests, no CLS)
- `next/image` with explicit dimensions for any photography
- Zero third-party scripts on critical pages
- PostHog loaded only after `requestIdleCallback`

Accessibility:

- WCAG 2.2 AA minimum, AAA where it doesn't fight the design
- All interactive elements have visible focus states (2px orange ring)
- Logical heading order on every page
- Skip-to-content link in header
- `prefers-reduced-motion` honored everywhere
- All SVG diagrams have descriptive `<title>` and `<desc>`

---

## Working with this repo

- `pnpm dev` — dev server
- `pnpm build` — production build (must pass before any commit to main)
- `pnpm lint` — ESLint + jsx-a11y
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier with `prettier-plugin-tailwindcss`
- `pnpm test` — Vitest (added in Phase 6+)

**Before committing:** Run `pnpm lint && pnpm typecheck && pnpm build`. Husky pre-commit hook enforces this.

**Branch strategy:** Currently on an isolated test branch. Do not merge to main until Phase 8 acceptance.

---

## What to do when something is ambiguous

1. Re-read the relevant section of `docs/brand-spec.md`.
2. Check `docs/components/` for component-specific guidance.
3. If still unclear, **ask in the conversation**. Do not guess and proceed. Generic output is the failure mode this whole project is built to avoid.
