# Build plan

Phased, sequential, each phase sized to roughly one Claude Code session. **Do not start Phase N+1 until Phase N's acceptance criteria pass.** This file is the source of truth for build order.

---

## Phase 0 — Repo reset (manual, one-time)

The existing repo on this branch is an old Next.js project. We keep `.git`, `.github/`, env files, and any docs worth saving, but replace everything user-facing.

**Commands (run manually, not by Claude Code):**

```bash
# Confirm the branch
git status
git branch --show-current

# Preserve anything worth keeping
mkdir -p .preserved
cp -r .github .preserved/ 2>/dev/null || true
cp .env.local .preserved/ 2>/dev/null || true
cp .env.example .preserved/ 2>/dev/null || true
cp README.md .preserved/ 2>/dev/null || true

# Snapshot everything in case we need to recover
git add -A && git commit -m "chore: snapshot before reset" --allow-empty

# Remove app code (preserves .git, .preserved, node-related lockfiles get rewritten)
shopt -s extglob 2>/dev/null
rm -rf !(\.git|\.preserved|\.gitignore)
# Or, more conservatively:
# rm -rf app pages src components lib styles public package.json pnpm-lock.yaml node_modules .next

# Run the scaffold script (see scripts/setup.sh)
bash scripts/setup.sh

# Restore preserved items
cp -r .preserved/.github . 2>/dev/null || true
cp .preserved/.env.local . 2>/dev/null || true
rm -rf .preserved

git add -A && git commit -m "chore: scaffold next.js 15 + tailwind v4"
```

**Done when:**
- `pnpm dev` boots a fresh Next.js 15 app
- Repo contains `CLAUDE.md`, `PLAN.md`, `docs/brand-spec.md`, `docs/components/logo.md`
- `.github/` workflows preserved if they existed
- Git history intact

---

## Phase 1 — Tokens, fonts, styleguide skeleton

**Goal:** Lock the design system before any UI is built. Nothing visual ships until every token from the brand spec is wired up and a `/styleguide` route renders them.

**Tasks:**
1. Configure Tailwind v4 with CSS-first `@theme` in `styles/tokens.css`. Mirror every token from CLAUDE.md (color, space, radius, font, stroke).
2. Self-host fonts in `public/fonts/`:
   - Cabinet Grotesk (Medium 500, Bold 700, Extrabold 800)
   - Inter (Variable, range 400–600)
   - JetBrains Mono (Variable)
   - Fraunces (Variable — for hero h1 only)
   - Declare with `@font-face` in `app/globals.css`, `font-display: swap`, preload only Inter 400 and Cabinet 600 in `<head>`.
3. Create `app/(system)/styleguide/page.tsx` with sections for:
   - Color swatches (every token, with hex + WCAG contrast against `--color-bg`)
   - Type scale (every named scale, both rendered + label)
   - Spacing scale (visual ruler)
   - Radius scale
   - Stroke weights
   - The 4-pillar grid showing the underlying 12-column system
4. Set `metadata.robots: 'noindex'` on the styleguide layout.
5. Configure strict TypeScript, ESLint with `jsx-a11y`, Prettier with `prettier-plugin-tailwindcss`, Husky pre-commit running `lint && typecheck`.

**Done when:**
- `/styleguide` renders all tokens correctly in dev
- No token values are hardcoded outside `styles/tokens.css`
- `pnpm build && pnpm typecheck && pnpm lint` all pass clean
- Fonts load without FOUT/FOIT (verify in Network tab)

---

## Phase 2 — Brand primitives

**Goal:** Build the irreducible brand atoms. Each gets added to the styleguide before being used elsewhere.

**Tasks:**
1. **`<Logo size>`** — implements the shared-stem MF monogram with optical stroke scaling per `docs/components/logo.md`. Props: `size: 16 | 24 | 32 | 48 | 72 | 120`, `variant: 'default' | 'accent' | 'framed'`. Renders inline SVG.
2. **`<EyebrowLabel>`** — the mono-label with leading orange divider. Props: `children`, `accent?: boolean` (orange vs muted), `divider?: boolean`.
3. **`<GridOverlay>`** — fixed-position hairline 12-column grid for visual debugging in dev. Toggle via `?grid=1` query param.
4. **`<Submark>`** — the four small system glyphs (topology, layer-stack, isometric-cube, compass). Props: `name: 'topology' | 'layers' | 'cube' | 'compass'`.
5. Add all four to the styleguide with every variant.

**Done when:**
- `<Logo>` renders pixel-correctly at all six sizes
- `<Logo>` is a Server Component (no `'use client'`)
- Styleguide shows every variant
- Visual diff against the spec: monogram has the shared stem, M valley at y=84

---

## Phase 3 — Navigation shell

**Goal:** Reusable header, footer, and mobile drawer that wrap every page from now on.

**Tasks:**
1. **`<Header>`** — sticky, 80px tall on desktop, 64px on mobile. Left: `<Logo size={32}>` + wordmark. Center: nav links (About, Experience, Work, Writing, Consulting, Products). Right: `Let's talk →` CTA button.
2. **`<MobileDrawer>`** — full-screen sheet (shadcn Sheet restyled). 22px nav items, generous spacing, mono metadata footer, miniature topology submark at the bottom.
3. **`<Footer>`** — large wordmark, nav repeat, social links (LinkedIn, GitHub, X, YouTube), copyright + location.
4. **`<ReadingProgress>`** — left-gutter mono indicator showing scroll position + current section name (only on large desktop, only on long content pages — opt-in via prop).
5. Wire all of the above into `app/layout.tsx`.
6. Build a placeholder home page that just renders `<Header />` + a hero text block + `<Footer />` to verify the shell.

**Done when:**
- Navigation works at 375px, 768px, 1024px, 1440px
- Mobile drawer traps focus and closes on Escape
- Keyboard tab order is logical
- Header doesn't shift content on scroll (use proper sticky positioning)
- Lighthouse Accessibility on the placeholder page: 100

---

## Phase 4 — The hero (highest-stakes phase)

**Goal:** Nail the homepage hero. This is the single most-visible asset on the site. Spend disproportionate effort here.

**Tasks:**
1. **`<TopologyHero>`** — the system topology SVG diagram with four horizontal layers (Interface, Intelligence, Services, Foundation), 12 nodes total, 4 orange critical-path nodes connected by orange arrows. Reference design in `docs/components/topology-hero.md` (build this doc as part of Phase 4).
2. Animate the diagram with Motion: nodes fade in stagger 40ms, critical-path lines draw themselves 800ms after node entrance, total animation under 1.6s. Respect `prefers-reduced-motion`.
3. **`<Hero>`** — two-column composition (text left, diagram right). Eyebrow label, Fraunces serif h1 "Better systems. / Better decisions. / Built to scale." with "scale" in orange italic, subhead in Inter, two CTAs (primary orange, ghost outlined).
4. **`<TrustBar>`** — five organization names below the hero: LifeSurge, Ramsey, Johns Hopkins All Children's, Publix, Scorpion. Set in Georgia for editorial weight, muted color, no logos.
5. Wire into `app/(marketing)/page.tsx`.

**Done when:**
- Hero looks correct at 375px (stacked, diagram below), 768px (stacked but larger type), 1024px (side-by-side as designed), 1440px (with side gutters)
- Diagram animation is smooth on a mid-range MacBook (60fps)
- Reduced-motion preference renders the final state instantly with no animation
- LCP element is the h1 text, not the diagram
- Lighthouse Performance on the home page: ≥ 98
- The hero is in the styleguide as `<Hero />` with placeholder content

---

## Phase 5 — Homepage sections

**Goal:** Complete the homepage by adding the remaining sections from the wireframe.

**Tasks (in order):**
1. **`<ServiceGrid>`** — four service cards (Architecture, AI Strategy, Automation, Leadership). Each card: submark icon top-left, short title, 2-line description, "Learn →" link. 4-column grid desktop, 2-col tablet, 1-col mobile.
2. **`<CaseStudyCard>`** — used in a list of 3–6 case studies, alternating image-left / image-right. Each card: eyebrow with date + org, h2 title, summary paragraph, 2–3 tags, "View case study →" link, custom diagram thumbnail (placeholder for now).
3. **`<ExperienceTimeline>`** — reads from `content/experience/timeline.json`. Renders as a vertical list: year range | org name | role | scope. Monospace year column, sans-serif details. Two CTAs below: "Full résumé →" and "Why I think in systems →".
4. **`<ProductGrid>`** — three product cards (PlainText, Nestly, Shepherd). Each: status badge (Live / Beta / Coming Soon), product name, one-line description, stack tags, "View →" link.
5. **`<WritingPreview>`** — three most-recent essays. Hero essay large with excerpt, two secondary essays as compact rows. "All writing →" link below.
6. **`<NewsletterCTA>`** — full-bleed dark section with editorial copy: "Get the dispatch." + subhead + email form (email input + Subscribe button). No image. Form is wired in Phase 7.

Each component added to styleguide first, then composed into `app/(marketing)/page.tsx`.

**Done when:**
- Homepage scrolls cleanly with consistent section rhythm (96px mobile / 160px desktop)
- All sections responsive at four breakpoints
- No section uses placeholder Lorem ipsum — use real draft copy from the brand spec
- Lighthouse on home page: Performance ≥ 98, all others 100

---

## Phase 6 — Content pipeline + writing template

**Goal:** Make publishing essays and case studies frictionless. Set up the MDX pipeline once, use it forever.

**Tasks:**
1. Install MDX pipeline: `next-mdx-remote`, `shiki`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.
2. Define content collection schemas in `lib/content-schemas.ts` with Zod:
   ```ts
   const essaySchema = z.object({
     title: z.string(),
     slug: z.string(),
     publishedAt: z.string().datetime(),
     pillar: z.enum(['architecture', 'ai', 'leadership', 'systems-thinking']),
     tags: z.array(z.string()),
     excerpt: z.string().max(220),
     ogImage: z.string().optional(),
     draft: z.boolean().default(false),
   });
   ```
3. Build `lib/mdx.ts` with `getAllEssays`, `getEssayBySlug`, `getAllCaseStudies`, `getCaseStudyBySlug`. Frontmatter parsed and validated against the schemas.
4. Build `<MDXComponents>` mapping with custom: h1–h4, p, a, ul, ol, code, pre (Shiki at build time), blockquote, hr.
5. Build custom MDX components: `<PullQuote>`, `<Callout type="note|warning|insight">`, `<Diagram src>`, `<Stat label value>`, `<Aside>`.
6. Build `<ArticleHeader>` — eyebrow (pillar + date), h1, byline + reading time.
7. Routes:
   - `app/(content)/writing/page.tsx` — essays index with filter by pillar
   - `app/(content)/writing/[slug]/page.tsx` — individual essay
   - `app/(content)/writing/tag/[tag]/page.tsx` — tag landing
   - `app/(content)/work/page.tsx` — case studies index
   - `app/(content)/work/[slug]/page.tsx` — individual case study
8. Write three test essays into `content/essays/` (one per pillar) and one case study in `content/case-studies/`. Use the 12-essay starter list from the brand spec for titles.
9. Build `app/api/og/[...slug]/route.tsx` using `@vercel/og` for dynamic social cards.

**Done when:**
- All three test essays render at `/writing/<slug>` with correct typography
- Pillar filtering works on `/writing`
- OG image generates correctly (test by inspecting metadata in dev tools)
- Code blocks have proper syntax highlighting with our color tokens
- Reading time computed correctly from word count

---

## Phase 7 — Remaining pages + integrations

**Tasks:**
1. **`/about`** — narrative page, photo top, faith framing section, philosophy section, timeline preview, CTA to consulting.
2. **`/experience`** — recruiter-optimized. Full role-by-role with scope, scale, technologies. Highly scannable.
3. **`/consulting`** — overview + service detail pattern. Each service (Architecture, AI Strategy, Automation, Fractional CTO, Advisory) gets a `/consulting/[service]` page with engagement model, deliverables, FAQ (with schema).
4. **`/products`** + three product detail pages (PlainText, Nestly, Shepherd).
5. **`/speaking`** — talks, podcasts, conferences. Simple list.
6. **`/newsletter`** — landing page + archive list.
7. **`/contact`** — form with react-hook-form + Zod + Resend integration.
8. **`/now`** and **`/uses`** — simple MDX-rendered system pages, updated monthly.
9. **`/colophon`** — how this site was built. Developer credibility.
10. **Integrations:**
    - Supabase tables: `newsletter_subscribers`, `contact_submissions`
    - Resend: API key + audience + double opt-in welcome email
    - Newsletter form `app/api/newsletter/subscribe/route.ts` — validates with Zod, inserts to Supabase, triggers Resend welcome
    - Contact form `app/api/contact/route.ts` — validates, inserts, sends notification to Mark
    - PostHog: install SDK, load after `requestIdleCallback`, track form submissions and key CTA clicks. Session replay only on `/consulting/*`.

**Done when:**
- Every route in the sitemap renders
- Newsletter signup works end-to-end (submit → DB row → welcome email arrives)
- Contact form works end-to-end
- PostHog events fire correctly (verify in PostHog dashboard)
- All form validation states are designed (idle, validating, error, success)

---

## Phase 8 — SEO, AI search, performance pass, launch

**Tasks:**
1. Build `lib/seo.ts` metadata helper. Every page exports `generateMetadata` using it.
2. JSON-LD schema on relevant pages:
   - `Person` on `/about` (name, jobTitle, sameAs, worksFor, alumniOf)
   - `ProfilePage` on `/about`
   - `Organization` at root (legal entity)
   - `Article` on every essay
   - `BreadcrumbList` on nested routes
   - `FAQPage` on consulting service pages
   - `WebSite` with SearchAction at root
3. Build `/llms.txt` and `/llms-full.txt` as dynamic routes that summarize the site for AI agents (template in brand spec).
4. RSS feed at `/rss.xml`, JSON feed at `/feed.json`, Atom at `/atom.xml`.
5. `app/sitemap.ts` and `app/robots.ts`.
6. Test rich results with Google's Rich Results Test on About, essays, consulting pages.
7. Submit to Search Console and Bing Webmaster Tools.
8. Performance audit:
   - Lighthouse on every major page
   - WebPageTest from a slow 4G connection
   - Bundle analysis via `@next/bundle-analyzer` — kill anything over budget
9. Accessibility audit:
   - `axe-core` automated scan
   - Manual keyboard navigation on every interactive element
   - VoiceOver/NVDA pass on home, about, one essay, one case study
10. Cross-browser test: Safari (Mac + iOS), Chrome, Firefox, Edge.
11. Set up Vercel Analytics and Web Vitals monitoring.
12. 301 redirect map for any prior URLs from the old project.
13. Deploy to production. Verify metadata, OG cards, sitemap, robots.

**Done when:**
- Lighthouse hits the targets in CLAUDE.md on every major route
- All forms work in production
- Schema validates against Schema.org
- `llms.txt` resolves and parses correctly (test: paste into ChatGPT/Claude and ask "summarize this person")
- Submission package ready for Awwwards / CSS Design Awards / Httpster

---

## Things that are explicitly out of scope (don't suggest)

- Dark mode toggle. Dark **is** the mode. Light mode exists in tokens for preview only.
- Internationalization. Single-language English.
- Comments on essays. Newsletter and email replies are the engagement layer.
- A CMS. File-based MDX is the system. Don't propose Sanity, Contentful, or similar.
- Pages router. App router only.
- Storybook. The `/styleguide` route is the design system documentation.
- Animation libraries beyond Motion (no GSAP, no Lottie, no Three.js).
- Email gating on the resume. Don't gate primary content.
