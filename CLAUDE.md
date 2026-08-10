# Mark Fasel — Personal brand site

Personal brand and consulting site for **Mark Fasel**, Solutions Architect & AI Strategist. This is the canonical context file for Claude Code. Read this before every task.

> **The single most important rule:** This is not a designer portfolio, freelancer portfolio, architecture firm site, or SaaS landing page. It is the digital headquarters of a working solutions architect with 20+ years of experience. When in doubt, choose the option that reads as a _publication_ rather than a _product_.

---

## Stack

**This section describes what is actually installed.** Anything under "Planned"
does not exist yet — do not import it, do not assume it, do not write code
against it. If you need something from the Planned list, build it first or ask.

### Installed and in use

- **Framework:** Next.js 16 (App Router, React 19.2, Server Components by default, Turbopack)
- **Language:** TypeScript 5, strict mode, `noUncheckedIndexedAccess: true`
- **Styling:** Tailwind v4 with CSS-first config via `@theme` in `styles/tokens.css`. No `tailwind.config.ts` for tokens.
- **UI primitives:** hand-built in `components/ui/` — `Button`, `Card`, `Field`/`Input`/`Textarea`/`Select`. **shadcn/ui is NOT installed and is not being used.** The primitives are token-pure and dependency-free; keep them that way rather than reaching for Radix.
- **Layout primitives:** `components/layout/` — `Container`, `Section`, `SectionHeader`. Every new section must build on these rather than re-rolling the container/gutter/padding/divider shell.
- **Forms:** `react-hook-form` + `zod` v4 + `@hookform/resolvers/zod`, submitting through a Next.js Server Action.
- **Email:** Resend (`resend`), used by the contact Server Action.
- **Animation:** **CSS only.** `motion` is installed but currently unused — all entrance/draw animation lives in `app/globals.css` behind `prefers-reduced-motion: no-preference`. Prefer CSS. Reach for Motion only when an interaction genuinely can't be expressed in CSS.
- **Hosting:** Vercel.
- **Package manager:** pnpm (workspace root — use `pnpm add -w`). Never `npm install` or `yarn`.
- **Node:** 22+. Pinned in `.nvmrc`.

### Content pipeline (wired)

- **MDX:** `next-mdx-remote/rsc` + `remark-gfm` + `rehype-slug`, compiled at build time by `/projects/[slug]` and `/writing/[slug]`.
- **Frontmatter:** parsed in `lib/mdx.ts`, validated by Zod in `lib/content-schemas.ts`. Malformed frontmatter fails `pnpm build` — that is deliberate.
- **Syntax highlighting:** `shiki` via `components/content/CodeBlock.tsx`, an async Server Component. Runs at build time; ships no JS.
- `rehype-autolink-headings` is installed but not yet enabled — heading ids come from `rehype-slug`; anchor links are a later addition.

> **Frontmatter gotcha:** `pnpm format` runs Prettier over `.mdx`, and Prettier reflows YAML arrays onto multiple lines. `splitFrontmatter` normalizes for this. If you add a frontmatter shape beyond flat scalars/arrays/booleans, adopt a real YAML parser rather than extending that function.

### Planned — NOT installed, do not reference

- **Supabase.** Deliberately deferred. The contact form sends via Resend and stores nothing. Add Supabase only when lead history or pipeline querying is actually needed.
- **PostHog.** Not installed. When it lands, load it after `requestIdleCallback`.
- **Vitest / any test runner.** There is no `pnpm test`. See "Working with this repo".

If you need a library that isn't listed under Installed, stop and ask before installing.

---

## File and directory conventions

Directories marked ○ exist today. Directories marked · are the agreed shape for
work not yet started — create them when you build into them, don't pre-scaffold.

```
app/
○ (marketing)/              Home, experience, about, consulting, contact
    contact/
      page.tsx              Server Component
      actions.ts            'use server' — the contact Server Action
      _components/          Page-scoped client islands (ContactForm)
○ (content)/
    projects/page.tsx, projects/[slug]/page.tsx Project index + detail
    writing/page.tsx, writing/[slug]/page.tsx  Essay index + detail
○ (system)/styleguide/      Internal design-system reference (noindex)
○ layout.tsx                Root layout: metadata, JSON-LD, Header, Footer
○ not-found.tsx             Branded 404
○ sitemap.ts, robots.ts
○ opengraph-image.tsx       Default social card (next/og)
○ twitter-image.tsx         Re-exports the OG card
· llms.txt/, rss.xml/, api/og/

components/
○ ui/                       Button, Card, Field (Input/Textarea/Select/Honeypot)
○ layout/                   Container, Section, SectionHeader
○ brand/                    Logo, Wordmark, Submark, EyebrowLabel, SectionLabel, GridOverlay
○ diagrams/                 TopologyHero
○ navigation/               Header, Footer, MobileDrawer, ReadingProgress, RoleLine
○ marketing/                Page sections (home + experience)
○ experience/               ExperiencePortrait
○ content/                  MDXComponents, CodeBlock, PullQuote, Callout, ArticleHeader

content/
○ experience/{timeline,career,work}.json
○ essays/*.mdx, projects/*.mdx
○ consulting/services.json, about/faq.json

lib/
○ nav.ts                    Navigation, identity, published-route gating
○ seo.ts                    buildMetadata() + absoluteUrl()
○ schema.ts                 JSON-LD builders
○ rate-limit.ts             In-memory throttle for the contact action
○ schemas/contact.ts        Zod contract shared by client + server
○ contrast.ts, utils.ts
○ mdx.ts                    Content loaders (fs, build-time only)
○ content-schemas.ts        Zod frontmatter contracts + pillars
· analytics.ts

styles/tokens.css           Tailwind v4 @theme tokens — single source of truth
public/fonts/               Self-hosted woff2 files
docs/                       Brand spec, component specs, audit, archive/
```

**Rules:**

- Server Components by default. Add `'use client'` only when you actually need client interactivity (state, effects, event handlers). Today there are exactly two client components: `MobileDrawer` and `ContactForm`. Keep it that way — scope islands to the interactive part, never the page.
- **Never build a section's shell by hand.** Use `<Section>` + `<SectionHeader>` + `<Container>`. The copy-pasted shell is what let card padding and button sizes drift; the primitives exist to stop it.
- **Never hand-roll a button or form control.** Use `<Button>` and `<Field>`. `<Field>` owns the label/description/error id wiring, which is why an unlabelled input can't ship.
- **Never link to a route that doesn't render.** `lib/nav.ts` gates every nav entry behind `published`. Define the route there (locking URL, label, order), flip `published` to true only once the page actually exists. Same pattern for `RESUME.available`.
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
--color-text-dim:         #8A857C
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

## Information architecture (approved 2026-08)

Primary nav — and it stays at five text links plus the contact CTA:

```
Experience · Projects · Writing · Consulting · About   [ Let's Talk → ]
```

Rules that are settled; don't relitigate them:

- **`/contact` is the canonical route. "Let's Talk" is the label.** Never the reverse.
- **`/experience` and `/projects` are both first-class primary-nav members.** Experience = career progression, scope, and leadership. Projects = systems independently architected, built, or planned.
- **Never collapse Experience into Projects.** The combination of enterprise career depth and independent product ownership is the differentiator.
- **Opsly and TrustLaunch have no implementation repository.** Their product pages are architecture documents, not descriptions of shipped software. Every one must lead with a status callout and use the `buildState` split (Built / In development / Roadmap). Never present a roadmap item as a built feature.
- **Products is live and is a first-class nav member.** The condition the IA set — "until a product actually exists" — was met when Helixon reached Launching.
- **Products vs Projects is an OWNERSHIP line, and it is settled.**
  - `/products` = ventures Mark owns (Helixon, TrustLaunch, Opsly, Clue Finder, PlainText, Shepherd). Lifecycle model: status enum, build state, timeline, roadmap.
  - `/projects` = work he was hired to do (Roghnu ERP, Scorpion Shared UI, Aviation ↔ Intacct, LIFE SURGE, Ramsey) + Labs. Engagement model: client, role, period.
  - Never list the same entity in both. Helixon, Opsly, Clue Finder, and TrustLaunch moved out of Projects with permanent redirects; `next.config.ts` redirect order is load-bearing (specific rules before the `/work/:slug` wildcard, or you get a two-hop chain).
- **Product structured data lives in `content/products/index.json`, not frontmatter.** `splitFrontmatter` parses only flat scalars, string arrays, and booleans — links, timeline, and roadmap are objects. MDX bodies carry narrative only.
- **`hasDetail` is derived, never authored.** It comes from whether a published MDX body exists, so a card can't link to a missing page and a Planned product can't leak into the sitemap.
- **Newsletter is an external Substack link** in the footer's platform list, not a nav route.
- **`/consulting` is a two-path entry point**, not one undifferentiated offer:
  1. Technology & Architecture Advisory — architecture, AI strategy, platform modernization, integrations, technical leadership
  2. AI Automation for Growing Businesses — trades, restaurants, medical offices, spas, agencies, professional services

  Vertical landing pages (`/consulting/ai-automation`, `/consulting/restaurants`, …) come later. Do not build them speculatively.

The primary pages are built. Remaining launch work is tracked in `PLAN.md`.

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

**There is no `pnpm test`.** No test runner is installed. Do not write tests
against a runner that doesn't exist, and do not claim tests pass. When testing
lands it will be Playwright smoke tests + `axe-core` in CI, not broad unit tests
— a marketing site doesn't earn those.

**Before committing:** Run `pnpm lint && pnpm typecheck && pnpm build`. Husky pre-commit hook enforces lint + typecheck.

### Environment variables

Server-only, never `NEXT_PUBLIC_`. Names documented in `.env.example`; real
values go in `.env.local` (gitignored).

- `RESEND_API_KEY` — contact form delivery
- `CONTACT_TO_EMAIL` — inbox that receives submissions
- `CONTACT_FROM_EMAIL` — From address, on a Resend-verified domain

The contact action degrades safely: missing env logs server-side and returns a
generic error to the visitor. It never breaks the build.

**Branch strategy:** currently on `refresh-branding`. See `PLAN.md` for the
launch roadmap and `docs/audit-2026-08.md` for the assessed state of the build.

---

## What to do when something is ambiguous

1. Re-read the relevant section of `docs/brand-spec.md`.
2. Check `docs/components/` for component-specific guidance.
3. If still unclear, **ask in the conversation**. Do not guess and proceed. Generic output is the failure mode this whole project is built to avoid.
