# Claude Code prompts — phase by phase

Copy each block verbatim into Claude Code at the start of the relevant phase. Each prompt assumes Claude Code has read `CLAUDE.md`, `PLAN.md`, and the relevant doc in `docs/`.

> **Before starting each phase:** confirm in chat with Claude Code by asking _"Have you read CLAUDE.md and PLAN.md?"_ If it hasn't, instruct it to read both before doing anything.

---

## Phase 1 — Tokens, fonts, styleguide

```
We're starting Phase 1 from PLAN.md. Read CLAUDE.md and PLAN.md in full
before doing anything else.

The scaffold in scripts/setup.sh has already been run. Verify the smoke-test
home page renders at localhost:3000.

Phase 1 goals:

1. Wire up the full Tailwind v4 @theme block in styles/tokens.css. Every
   token from CLAUDE.md must be present. Do not omit any.

2. Self-host fonts. Download Cabinet Grotesk (Medium/Bold/Extrabold),
   Inter (Variable 400-600), JetBrains Mono (Variable), and Fraunces
   (Variable). Place woff2 files in public/fonts/ and declare them with
   @font-face in app/globals.css. font-display: swap. Preload only Inter 400
   and Cabinet 600 in the <head> via next/font/local or manual <link>.

3. Build the styleguide at app/(system)/styleguide/page.tsx. Set
   metadata.robots = 'noindex' on its layout. The page must include:
   - Color section: every color token as a swatch + hex + WCAG ratio vs --color-bg
   - Type section: every named scale rendered with its label
   - Spacing section: visual ruler showing space-1 through space-11
   - Radius section: every radius value
   - Stroke weights section
   - A toggle that overlays the 12-column grid

4. Configure ESLint with jsx-a11y. Configure Husky pre-commit running
   `pnpm lint && pnpm typecheck` via lint-staged.

5. Run `pnpm build && pnpm typecheck && pnpm lint` — must all pass clean.

Constraints:
- No tokens hardcoded outside styles/tokens.css. No exceptions.
- No 'use client' directives in Phase 1. Everything is Server Components.
- Don't proceed to Phase 2 until I confirm acceptance.

When done, list each file you created or modified, and post a screenshot
description of /styleguide so I can verify before merging.
```

---

## Phase 2 — Brand primitives

> NOTE (updated): The logo is finalized as the Mark Fasel mark (not a monogram).
> See docs/components/logo.md and docs/components/wordmark.md. The Logo and
> Wordmark components below should be built from those specs, not from any
> monogram description. The mark SVG assets are in /public/brand/.

```
Phase 1 is accepted. Starting Phase 2.

Read docs/components/logo.md in full. This is the spec for the <Logo>
component. Build it exactly as described — the shared-stem construction
and optical stroke table are non-negotiable.

Build, in order:
1. components/brand/Logo.tsx — per docs/components/logo.md
2. components/brand/Wordmark.tsx — Cabinet Grotesk 600, letter-spacing 0.14em,
   uppercase "MARK FASEL". Props: size ('sm' | 'md' | 'lg').
3. components/brand/EyebrowLabel.tsx — mono-label with optional leading
   24px orange divider line. Props: children, accent? (orange vs muted),
   divider? (boolean, default true).
4. components/brand/GridOverlay.tsx — fixed-position 12-column hairline
   grid for visual debugging. Render only when search param ?grid=1.
   Must be a Server Component reading searchParams.
5. components/brand/Submark.tsx — the four system glyphs. Props:
   name ('topology' | 'layers' | 'cube' | 'compass'), size (number,
   default 24). Inline SVG, monoline 1px stroke. Topology = 3 connected
   nodes with one orange. Layers = 3 stacked rects with middle orange.
   Cube = isometric wireframe with one orange edge. Compass = circle with
   crosshair and one orange arm.

Add every component to /styleguide with all variants visible. After each
component lands, run `pnpm build && pnpm typecheck && pnpm lint`. Stop and
ask before proceeding if anything fails.

Acceptance: I will visually verify the monogram against the construction
spec. The M valley must sit at y=84 in the viewBox. The shared stem must
be visually continuous.
```

---

## Phase 3 — Navigation shell

```
Phase 2 is accepted. Starting Phase 3 — navigation shell.

Build the reusable navigation that wraps every page:

1. components/navigation/Header.tsx — sticky, 80px desktop / 64px mobile.
   Left: <Logo size={32}> + <Wordmark size="sm">. Center (desktop only):
   nav links (About, Experience, Work, Writing, Consulting, Products) in
   Inter 13px. Right: orange "Let's talk →" button. On mobile, replace
   center+right with a hamburger that opens MobileDrawer. Border-bottom
   0.5px var(--color-border). Backdrop-blur acceptable on scroll.

2. components/navigation/MobileDrawer.tsx — uses shadcn Sheet, restyled.
   Full-height, slides from the right. 22px Cabinet Grotesk nav items.
   Generous spacing (var(--space-5) between). At the bottom: mono metadata
   ("SOLUTIONS ARCHITECT · AI STRATEGIST") and a small <Submark name="topology">.
   Focus trap, Escape to close, proper aria attributes. This must be a
   client component — mark with 'use client'.

3. components/navigation/Footer.tsx — large wordmark, two-column layout
   desktop (links left, social right), stacked on mobile. Nav repeat:
   About, Experience, Work, Writing, Consulting, Products, Newsletter,
   Contact. Social: LinkedIn, GitHub, X, YouTube. Bottom line: copyright
   year + "Tampa, FL" in mono.

4. components/navigation/ReadingProgress.tsx — left-gutter mono indicator
   for long-form pages. Shows current section name and scroll % through
   the article. Only visible at >= 1440px width. Opt-in via prop.
   Client component.

5. Wire Header + Footer into app/layout.tsx so they appear on every page.
   Update the placeholder app/page.tsx so the hero text sits between them.

Add Header, MobileDrawer, Footer to /styleguide.

Acceptance:
- Navigation works at 375px, 768px, 1024px, 1440px (verify each)
- Keyboard tab order through header is logical
- Mobile drawer traps focus and closes on Escape
- pnpm build clean
- Lighthouse Accessibility on the placeholder home: 100
```

---

## Phase 4 — The hero

```
Phase 3 is accepted. Starting Phase 4 — the homepage hero. This is the
single highest-stakes phase. Spend the time.

Before writing any code, create docs/components/topology-hero.md
documenting the diagram structure. Reference the description below.
Then build the components.

The TopologyHero diagram:
- 4 horizontal layers, labeled L4/INTERFACE, L3/INTELLIGENCE,
  L2/SERVICES, L1/FOUNDATION (mono labels at the left edge)
- Each layer contains 3-4 nodes, 12 nodes total
- Most nodes use border --color-border (subtle, ambient)
- 4 nodes per layer use border --color-accent (the critical path)
- Orange critical-path arrows connect the orange nodes vertically with
  L-bends — exactly 3 arrows total
- Mono caption at top-right: "FIG 01 — REFERENCE ARCH"
- Mono caption at bottom-left: "4 LAYERS · 12 NODES"
- Bottom-right: small orange dot + "CRITICAL PATH" label

Components to build:

1. components/diagrams/TopologyHero.tsx — the SVG. Server Component for
   the static structure. Inline SVG, viewBox 0 0 680 460. Use the design
   exactly from our prior conversation as the reference.

2. components/diagrams/TopologyHeroAnimated.tsx — client wrapper that
   uses Motion to:
   - Fade in nodes with 40ms stagger (all 12 nodes, layer-by-layer)
   - Draw the 3 critical-path lines after nodes (stroke-dashoffset
     animation, 600ms each, sequential)
   - Total animation under 1.6s
   - Respect prefers-reduced-motion: render the final state instantly
   Use Motion's useInView so it animates when visible, not on mount.

3. components/marketing/Hero.tsx — the two-column composition:
   - Left column (50%): <EyebrowLabel accent>SOLUTIONS ARCHITECT · AI STRATEGIST</EyebrowLabel>,
     h1 in Fraunces serif 64px desktop / 48px mobile, three lines:
     "Better systems." / "Better decisions." / "Built to scale."
     with "scale." in italic + --color-accent. Subhead in Inter 17/19px,
     --color-text-muted, max-width 440px. Two CTAs: primary orange
     "See the work →" linking to /work, ghost outlined "Read the thinking"
     linking to /writing.
   - Right column (50%): <TopologyHeroAnimated /> wrapped in a card with
     0.5px border and the mono metadata header.
   - On mobile and tablet: stacks vertically, diagram below text.

4. components/marketing/TrustBar.tsx — mono eyebrow "TRUSTED BY
   ORGANIZATIONS INCLUDING", then five org names laid out evenly:
   LifeSurge, RAMSEY, Johns Hopkins All Children's Hospital, Publix,
   SCORPION. Set in Georgia serif for editorial weight. Color
   --color-text-muted. No logos, just typography. Scrolls horizontally
   on mobile with snap points.

5. Wire Hero + TrustBar into app/(marketing)/page.tsx.

Acceptance:
- Hero correct at 375, 768, 1024, 1440 (test all four)
- Diagram animation smooth at 60fps on a mid-range MacBook
- prefers-reduced-motion renders the final frame instantly
- LCP element is the h1, not the diagram (verify in Lighthouse)
- Lighthouse Performance on the home page >= 98
- Hero added to /styleguide with placeholder content
```

---

## Phase 5 — Homepage sections

```
Phase 4 accepted. Starting Phase 5 — completing the homepage.

Build these in order, each added to /styleguide before composing into
app/(marketing)/page.tsx:

1. components/marketing/ServiceGrid.tsx — four cards (Architecture,
   AI Strategy, Automation, Leadership). Each card uses a <Submark> at
   top-left, h3 title in Cabinet Grotesk, 2-line description in Inter
   --color-text-muted, "Learn →" link in mono at the bottom. 4-col
   desktop, 2-col tablet, 1-col mobile. Card has 0.5px border, no fill.

2. components/marketing/CaseStudyCard.tsx — featured-case-study card.
   Props: orientation ('left' | 'right'), eyebrow (org + year), title,
   summary, tags (string[]), href, thumbnail (ReactNode — placeholder
   for now, will be custom diagrams later). Alternating layouts.

3. components/marketing/ExperienceTimeline.tsx — reads from
   content/experience/timeline.json. Create that file first with the
   five roles from CLAUDE.md (LifeSurge, Ramsey, Johns Hopkins, Publix,
   Scorpion). Display as vertical list: mono year-range column | sans
   role+org column. Below the list, two link CTAs: "Full résumé →" and
   "Why I think in systems →".

4. components/marketing/ProductGrid.tsx — three product cards
   (PlainText, Nestly, Shepherd). Each shows: status badge (Live /
   Beta / Coming Soon, with appropriate semantic color), product name,
   one-line description, stack tags in mono, "View →" link.

5. components/marketing/WritingPreview.tsx — three most-recent essays.
   First essay larger with excerpt visible, two below as compact rows
   with just title + date + reading time. "All writing →" link below.
   Reads from content/essays/ — for now, scaffold three placeholder
   .mdx files with frontmatter only.

6. components/marketing/NewsletterCTA.tsx — full-bleed section. Editorial
   copy: h2 "Get the dispatch.", subhead "One essay a week on architecture,
   AI, and the systems that compound. No promotions, no spam.", then a
   form with email input + Subscribe button. Form submission is stubbed
   for now (just console.log) — will be wired in Phase 7.

Compose into app/(marketing)/page.tsx so the homepage scrolls cleanly:
Hero → TrustBar → ServiceGrid → CaseStudyCard×3 → ExperienceTimeline →
ProductGrid → WritingPreview → NewsletterCTA → Footer.

Section rhythm: var(--space-9) padding-block mobile, var(--space-10) tablet,
160px desktop. Each section separated by border-top 0.5px var(--color-border).

Acceptance:
- All sections responsive at four breakpoints
- Real draft copy from the brand spec — no Lorem ipsum
- Lighthouse on home page: Performance >= 98, all others = 100
```

---

## Phase 6 — Content pipeline

```
Phase 5 accepted. Starting Phase 6 — MDX content pipeline.

Follow PLAN.md Phase 6 to the letter. Pay special attention to:

- Zod schemas for essay/case-study frontmatter
- Shiki at BUILD TIME — no runtime syntax highlighting, no client JS for
  code blocks
- Dynamic OG image generation via @vercel/og at /api/og/[...slug] — every
  essay gets a generated social card using the brand typography and colors
- llms.txt and llms-full.txt as dynamic routes — read the template from
  docs/brand-spec.md

Write three real test essays into content/essays/ using titles from the
starter calendar in docs/brand-spec.md:
1. "Why I think in systems" (pillar: systems-thinking)
2. "The architect's job is decisions, not diagrams" (pillar: architecture)
3. "How to know if your AI strategy is real" (pillar: ai)

These don't need to be finished essays — 600-800 words of plausible draft
content each, enough to test the pipeline. Include at least one <PullQuote>,
one <Callout>, and one code block per essay.

Acceptance:
- All three essays render at /writing/<slug> with correct typography
- Pillar filtering works on /writing
- OG card renders correctly when you visit /api/og/writing/<slug>
- Code blocks syntax-highlighted with our color tokens
- Reading time accurate (computed from word count, 200wpm)
- /llms.txt returns plain text that parses cleanly when pasted into Claude
```

---

## Phase 7 — Remaining pages + integrations

```
Phase 6 accepted. Starting Phase 7. Follow PLAN.md Phase 7.

Order of operations:
1. About page first (most-visited recruiter destination)
2. Experience page
3. Consulting overview + service detail template
4. Products index + 3 product pages
5. Speaking, Newsletter landing, Now, Uses, Colophon
6. Contact form with full Resend integration
7. Supabase tables and API routes for newsletter + contact
8. PostHog wiring (lazy-loaded, only after requestIdleCallback)

For each page, draft real copy from the brand spec — declarative,
specific, first-person singular. No filler.

For integrations:
- Verify newsletter signup end-to-end with a real test email
- Verify contact form sends a notification to a real address
- Confirm PostHog events fire in the dashboard

Acceptance:
- Every route in the sitemap from docs/brand-spec.md renders
- All form states designed (idle / validating / error / success)
- Forms work in production preview (deploy to Vercel preview branch)
- PostHog session replay enabled only on /consulting/*
```

---

## Phase 8 — SEO, AI, launch

```
Phase 7 accepted. Starting Phase 8 — the launch phase.

Follow PLAN.md Phase 8.

Key deliverables, in order:
1. lib/seo.ts metadata helper, used on every page
2. JSON-LD schema on every relevant page (Person, ProfilePage, Article,
   Organization, BreadcrumbList, FAQPage, WebSite)
3. llms.txt + llms-full.txt + rss.xml + feed.json + atom.xml
4. sitemap.ts + robots.ts
5. Validate rich results with Google's test tool
6. Performance pass — run Lighthouse on every major route, fix anything
   below targets in CLAUDE.md
7. Accessibility pass — axe + manual keyboard nav + VoiceOver on
   home/about/one essay/one case study
8. Cross-browser test on Safari Mac+iOS, Chrome, Firefox, Edge
9. Vercel Analytics + Web Vitals monitoring
10. 301 redirect map for any URLs from the prior project (check
    .preserved/ for the old site structure)
11. Production deploy

After deploy:
- Test llms.txt by pasting into ChatGPT/Claude/Perplexity: "Summarize
  this person." Verify the description is accurate and flattering.
- Verify OG cards by sharing a few pages on LinkedIn (use LinkedIn's
  Post Inspector tool)
- Submit to Search Console, Bing Webmaster Tools

Acceptance:
- All Lighthouse targets hit on every major route
- All forms working in production
- Schema validates against Schema.org
- Site is live at the canonical domain
- Submission package prepared for Awwwards / CSS Design Awards
```
