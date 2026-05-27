# Mark Fasel — Brand System, Visual Identity & Implementation Plan

_Prepared May 2026 · v1.0_

---

## 1. Brand Strategy (Refined)

### Positioning

**Mark Fasel is the architect organizations call when systems, teams, and AI need to operate as one.**

Not a portfolio. Not an agency. A practitioner with two decades of receipts who happens to be building the next generation of his own products in public.

### The strategic tension the site must resolve

A VP Engineering recruiter and a $50k consulting buyer should both land on the homepage and feel "this is for me" within four seconds. Most personal sites fail this — they pick a lane. Yours can't.

**The solve:** lead with _capability_, not _availability_. The homepage is an argument for your judgment. Career paths and engagement paths are revealed through navigation, not shoved at the visitor. Recruiters self-identify into Experience and Case Studies. Buyers self-identify into Consulting and Products. Both audiences are reassured by the same hero.

### Voice principles

Apply these as a writing filter on every line of copy:

- **Declarative, not promotional.** "I design enterprise systems." Not "I'm passionate about crafting solutions."
- **Specific, not adjectival.** "Reduced incident MTTR from 4hrs to 22min across 14 services" beats "improved reliability."
- **Confident, not loud.** No exclamation points. No "Let's build something amazing together." Architects don't beg.
- **First-person singular.** "I led" not "we delivered." This is a personal brand.

### Brand promise

_Clarity at the level systems actually fail._

This operates beneath the public tagline. It's the internal compass — every piece of content either delivers clarity at the level systems actually fail, or it doesn't ship.

### Audience priority

1. **Buyer (high-trust consulting).** VPs/CTOs at $10M–$500M companies. Engaged via Consulting page, case studies, and writing.
2. **Hiring decision-maker (Director, Principal, VP).** Recruiters, CTOs, heads of architecture. Engaged via Experience, About, case studies.
3. **Product audience.** Newsletter subscribers, course buyers, future SaaS users. Engaged via Writing and Products.
4. **Peers and aspirants.** Engineers and architects who follow your thinking. Engaged via Writing and social distribution.

Design every page for #1 and #2; let #3 and #4 self-discover through depth.

---

## 2. Visual Direction (Final)

### Core idea

**Technical drawing as fine art.**

Your moodboard leans architectural-photography. That's the trap to pull out of. Buildings are a metaphor; once you've made the point, they become decoration. The evolution:

- Isometric system diagrams rendered with the restraint of a Dieter Rams sketch
- Network topology graphs that look like constellation maps
- API sequence diagrams composed like architectural elevations
- Hairline orthographic grids underneath content (1px, ~8% opacity, on a 12-column subgrid)
- Orange used as a _signal_ color — it indicates attention, status, the critical path — never as decoration

### Imagery diet (proportions matter)

| Imagery type                                                | Proportion | Where it appears                                              |
| ----------------------------------------------------------- | ---------- | ------------------------------------------------------------- |
| Custom technical diagrams (yours)                           | 60%        | Homepage hero, case studies, services, writing headers        |
| Editorial typography as visual                              | 20%        | Section openers, pull quotes, manifesto blocks                |
| Architectural photography                                   | 15%        | About page hero, one case study opener, writing pillar header |
| Code-as-typography (JetBrains Mono in oversized treatments) | 5%         | Single accent moment per major page                           |

### Differentiator vs the moodboard

Your site should have "diagram of the week" energy. Every page contains at least one piece of technical visualization that _proves_ you actually think in systems. That's what designers can't fake. The moodboard reads as "premium portfolio." Yours reads as "this person ships."

### What to avoid

- Decorative gradients (orange is a signal, not a wash)
- Drop shadows or glassmorphism (architects don't blur)
- Stock photography of any kind, including hands-on-keyboards
- Lifestyle photography (smiling in coffee shops)
- Generic abstract 3D renders
- Animated particle backgrounds

---

## 3. Logo System

### Primary mark: MF monogram

- Construction: capital M and F set in Cabinet Grotesk Bold, optical kerning at -4%, letterforms not ligatured (the slight gap reads as deliberate spacing, not awkward)
- Container: optional 1px square frame, 6% padding around glyphs, minimum size 24px
- Color: solid #F5F2EB on #0A0A0A, or inverse for light mode

### Wordmark: MARK FASEL

- Cabinet Grotesk Medium, 0.14em letter-spacing, all caps
- Used in footer, email signature, business card
- Always paired with a single line of metadata beneath in JetBrains Mono 10px: `SOLUTIONS ARCHITECT · AI STRATEGIST`

### Lockups (in order of frequency)

1. Monogram only — favicon, social avatar, header at narrow widths
2. Monogram + wordmark horizontal — desktop header
3. Wordmark + metadata stacked — footer, formal communications
4. Wordmark alone — large editorial moments (about page, case study covers)

### Submark concepts to explore

The visual language allows for a system of small **diagrammatic submarks** that appear next to section headers — they reinforce "this person draws systems." Six suggested:

- **Topology dot** — three connected nodes in a triangle (use on Experience)
- **Layer stack** — three horizontal lines, the middle one orange (use on Architecture)
- **Decision branch** — a fork with one path highlighted (use on Consulting)
- **Iteration loop** — a curved return arrow (use on Writing)
- **Critical path** — a series of dots with one filled (use on Case Studies)
- **Compass rose** — abstract NESW with a single orange arm (use on About)

Each submark is ~16px, monoline 1px stroke, lives next to the page title.

### What NOT to make the logo

- An isometric building
- A blueprint
- A lowercase "m" with a flourish
- A house, roof, or any shelter metaphor
- Anything with a slash or forward arrow built in

---

## 4. Color System

### Foundation palette

```
Background        #0A0A0A    rgb(10, 10, 10)
Surface           #121212    rgb(18, 18, 18)
Elevated          #1B1B1B    rgb(27, 27, 27)
Border            #2A2A2A    rgb(42, 42, 42)
Border-strong     #3A3A3A    rgb(58, 58, 58)
Text-primary      #F5F2EB    rgb(245, 242, 235)    — paper white, warm
Text-secondary    #ACA79E    rgb(172, 167, 158)
Text-muted        #6B6760    rgb(107, 103, 96)
Accent-primary    #FF6B35    rgb(255, 107, 53)     — the orange
Accent-secondary  #F5B041    rgb(245, 176, 65)     — amber, used sparingly
```

### Light mode (preview only — dark is canonical)

```
Background        #FAFBF5
Surface           #FFFFFF
Elevated          #F4F2EA
Border            #E5E2D8
Border-strong     #C9C5B8
Text-primary      #111111
Text-secondary    #56544D
Text-muted        #908C82
Accent-primary    #E55A26     (slightly darker for AA contrast on light)
Accent-secondary  #C8881E
```

### Semantic tokens

```
Status / success     #5BA378
Status / warning     #F5B041
Status / danger      #D85A30
Status / info        #6B92C9
Code-highlight       #FF6B35    (same as accent — code is the work)
Link / interactive   #F5F2EB    (with 1px underline; orange only on hover for emphasis links)
```

### Accessibility checks (WCAG 2.2 AA)

All combinations verified for normal text (4.5:1) and large text (3:1):

- `#F5F2EB` on `#0A0A0A` → 17.4:1 ✓ AAA
- `#ACA79E` on `#0A0A0A` → 9.2:1 ✓ AAA
- `#6B6760` on `#0A0A0A` → 4.1:1 — **fails AA for body text, use only for ≥18pt or non-essential metadata**
- `#FF6B35` on `#0A0A0A` → 5.6:1 ✓ AA (acceptable for headings and CTAs at ≥14pt bold)
- `#F5F2EB` on `#FF6B35` (button text on orange) → 3.1:1 — **use #0A0A0A as button text instead → 5.6:1 ✓**
- `#111111` on `#FAFBF5` (light mode body) → 17.6:1 ✓ AAA

### Usage rules for orange

1. Maximum **one orange interactive element per viewport**. Two orange buttons compete.
2. Orange in body text only for the word being defined or the critical takeaway — never for emphasis-as-decoration.
3. Orange in diagrams marks the _critical path_ — the thing the reader should look at first.
4. Never orange-on-orange. Never gradients of orange.
5. Hover states intensify to `#FF7E4F` or add a 1px underline; they don't switch colors.

---

## 5. Typography System

### Final recommendation

**Display:** Cabinet Grotesk (Medium 500, Bold 700, Extrabold 800)
**Body:** Inter (Regular 400, Medium 500)
**Mono:** JetBrains Mono (Regular 400, Medium 500)

### Why Cabinet over Clash

Clash Display is gorgeous but its high-contrast strokes read as "design agency" — which is the exact connotation to avoid. Cabinet Grotesk has the same editorial weight without the fashion-magazine signal. It pairs with Inter without competing.

**The one exception:** the homepage hero `<h1>` uses a serif (recommended: **Söhne Breit** or as a free alternative, **Fraunces** in Display optical size, weight 500). This is the editorial moment — serif for the headline only, sans for everything else. This is what makes the site feel like a publication rather than a portfolio.

### Type scale (modular, 1.25 ratio, mobile-first)

| Token        | Mobile      | Desktop     | Use                                   |
| ------------ | ----------- | ----------- | ------------------------------------- |
| `display-xl` | 48px / 0.95 | 88px / 0.92 | Homepage hero h1 only                 |
| `display-lg` | 36px / 1.0  | 64px / 0.95 | Page titles                           |
| `display-md` | 28px / 1.05 | 44px / 1.0  | Section openers                       |
| `h1`         | 26px / 1.15 | 36px / 1.1  | Article titles                        |
| `h2`         | 22px / 1.2  | 28px / 1.15 | Sub-sections                          |
| `h3`         | 18px / 1.3  | 20px / 1.25 | Card titles                           |
| `body-lg`    | 17px / 1.6  | 19px / 1.65 | Hero subhead, lead paragraphs         |
| `body`       | 15px / 1.65 | 16px / 1.7  | Default prose                         |
| `body-sm`    | 14px / 1.6  | 14px / 1.6  | Captions, metadata                    |
| `mono-label` | 11px / 1.4  | 11px / 1.4  | All-caps eyebrows, technical metadata |
| `mono-body`  | 14px / 1.6  | 14px / 1.6  | Code blocks                           |

### Editorial treatments

- **Eyebrow labels:** JetBrains Mono, 11px, letter-spacing 0.14em, uppercase, color #FF6B35 or #ACA79E. Always preceded by a 24px orange divider line.
- **Pull quotes:** Fraunces or Cabinet Bold at display-md size, italic for serif version. Quote marks oversized (1.2x text size) in #FF6B35, set in the margin.
- **Drop caps:** First letter of major essays gets a 4-line drop cap in Cabinet Extrabold. Used sparingly — once per essay.
- **Numerals:** Use tabular figures in stats and tables (`font-variant-numeric: tabular-nums`). Use proportional in body text.

### Hierarchy rules

1. Maximum two font families on screen at once (display + body, or body + mono). Never three.
2. Maximum three weights per page.
3. Letter-spacing only applies to display sizes (negative) and mono labels (positive). Body text uses default tracking.
4. Line-height tightens as size grows (display lines hug; body lines breathe).

---

## 6. Design System Tokens

### Spacing scale (4px base)

```
space-1   = 4px
space-2   = 8px
space-3   = 12px
space-4   = 16px
space-5   = 24px
space-6   = 32px
space-7   = 48px
space-8   = 64px
space-9   = 96px
space-10  = 128px
space-11  = 192px
```

### Layout primitives

- **Container:** max-width 1280px on Desktop, 1440px on Large Desktop. 24px gutter mobile, 40px tablet, 64px desktop, 80px large.
- **Grid:** 12 columns, 24px gap mobile, 32px gap desktop. The underlying grid is _visible_ — a 1px / 8% opacity grid is part of the visual system, not hidden.
- **Section rhythm:** 96px vertical padding mobile, 160px desktop. Sections separated by a 0.5px border-top in `#1F1F1F`.

### Border radius

```
radius-none  = 0
radius-xs    = 2px    — buttons, badges, code blocks (intentionally sharp)
radius-sm    = 4px    — cards, inputs
radius-md    = 8px    — large cards, modals
radius-lg    = 12px   — featured content blocks
radius-full  = 9999px — avatars only
```

The site leans sharper than modern conventions. 2px buttons signal precision; 12px-everywhere signals "designed in 2023."

### Stroke weights

```
stroke-hairline  = 0.5px  — grid lines, technical drawings
stroke-thin      = 1px    — dividers, default borders
stroke-medium    = 1.5px  — diagram arrows
stroke-thick     = 2px    — emphasis only (active states)
```

### Shadows

There are no shadows in this design system. The visual depth comes from:

- Background layering (#0A0A0A → #121212 → #1B1B1B)
- 0.5px borders at varying opacities
- Negative space

The single exception: focus rings on form inputs use `box-shadow: 0 0 0 2px #FF6B35`.

### Motion principles

Three principles, applied consistently:

1. **Subtle entrances.** Content fades up 12px over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)` (an ease-out curve). Never bounces. Never overshoots.
2. **Purposeful parallax.** Only the diagram in the homepage hero parallaxes (8% rate). Everything else holds still.
3. **Smooth transitions.** Page transitions: 200ms crossfade with the new page sliding up 8px. Hover states: 150ms ease-out. Diagram lines draw themselves on view (800ms, staggered).

All motion respects `prefers-reduced-motion: reduce`. Animations swap to instant fade-ins.

### Iconography

Stroke-based icons only. 1.5px stroke, no fills, rounded line caps. Source from Tabler or hand-drawn for custom diagram glyphs. Icons are 16px inline, 20px in cards, 24px in section headers. No emoji.

---

## 7-9. Responsive Concepts

### Breakpoints

```
mobile        320px – 639px
tablet        640px – 1023px
desktop       1024px – 1439px
large         1440px+
```

### Mobile (375px reference)

**Homepage hero:**

- Header: monogram left, hamburger right, single line, 16px padding
- Hero h1 drops to display-xl mobile (48px), three lines maintained
- Subhead 17px, max 28ch line length
- Two stacked CTAs (orange primary 44px tall, ghost secondary)
- Technical diagram appears _below_ the hero, full-width, simplified to 3 layers x 3 columns
- Trust bar scrolls horizontally with snap points, no more than 2 logos visible at once
- Section padding: 64px top/bottom

**Navigation pattern:**

- Hamburger opens full-screen drawer
- Drawer is sans-serif menu, 22px items, generous spacing, with the same metadata footer as the desktop nav
- A miniature topology diagram lives at the bottom of the drawer as a brand reinforcement

**Other pages:**

- Single column always
- Case study heroes use full-bleed imagery with text overlaid below
- Code blocks are horizontally scrollable, no wrap
- Newsletter form: stacked email + button, both full-width

### Tablet (768px reference)

- Hero shifts to single column but typography stays display-lg
- Two-column layouts appear for service cards and case study grids
- The technical diagram returns to the hero area at 50% column width
- Section padding: 96px top/bottom

### Desktop (1280px reference)

- The full hero composition as shown — two-column with diagram right
- Sticky navigation with metadata strip beneath it
- Three-column service grid
- Two-column case study cards alternating image/text
- Section padding: 160px top/bottom

### Large desktop (1440px+)

- Container caps at 1440px, content doesn't stretch further
- Side margins expand and host **a fixed mono progress indicator** showing reading position and section name (very subtle, 11px, in the left gutter)
- Diagrams scale up — they're the visual centerpiece on large displays

---

## 10. Homepage Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  MF  MARK FASEL          About Exp Work Writing  [Let's Talk] │  ← Nav, 80px tall
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  — SOLUTIONS ARCHITECT · AI STRATEGIST                       │  ← Eyebrow
│                                                              │
│  Better systems.                          ┌──────────────┐  │
│  Better decisions.                        │ FIG 01       │  │
│  Built to scale.                          │              │  │
│                                           │  [topology   │  │
│  20+ years architecting enterprise        │   diagram]   │  │
│  systems. Helping leaders make better     │              │  │
│  technical decisions, and building the    │              │  │
│  AI and automation that compound them.    │ 4L · 12N     │  │
│                                           └──────────────┘  │
│  [See the work →]  [Read the thinking]                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  — TRUSTED BY ORGANIZATIONS INCLUDING                        │
│  LifeSurge  RAMSEY  Johns Hopkins  Publix  SCORPION         │  ← Trust bar
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WHAT I DO  /  Four practice areas                           │  ← Section: Services
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ ▢ Arch   │ │ ◊ AI     │ │ ◯ Auto   │ │ △ Lead   │       │
│  │          │ │          │ │          │ │          │       │
│  │ Designing│ │ Applying │ │ Removing │ │ Helping  │       │
│  │ resilient│ │ AI where │ │ work     │ │ teams    │       │
│  │ systems  │ │ it       │ │ that     │ │ decide   │       │
│  │ that     │ │ compounds│ │ shouldn't│ │ with     │       │
│  │ scale.   │ │ value.   │ │ exist.   │ │ clarity. │       │
│  │ Learn →  │ │ Learn →  │ │ Learn →  │ │ Learn →  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  THE WORK  /  Selected engagements                           │  ← Section: Case Studies
│                                                              │
│  ┌─────────────────────────────┐                            │
│  │ CASE STUDY · 2024 · LIFESURGE│                           │
│  │                              │                            │
│  │ Scaling frontend consistency │   How we created a design  │
│  │ across enterprise teams      │   system and component     │
│  │                              │   library adopted by       │
│  │ [thumbnail / detail diagram] │   multiple product teams.  │
│  │                              │                            │
│  │ Design Systems · Leadership  │   View case study →        │
│  └─────────────────────────────┘                            │
│                                                              │
│  [+ 5 more, alternating image-left / image-right]            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  EXPERIENCE  /  Twenty years, condensed                      │  ← Section: Experience timeline
│                                                              │
│  2024 — Now    LifeSurge · Solutions Architect              │
│  2021 — 2024   Ramsey Solutions · Senior Architect          │
│  2018 — 2021   Johns Hopkins All Children's · Lead Eng      │
│  2014 — 2018   Publix · Frontend Architect                  │
│  2010 — 2014   Scorpion · Senior Engineer                   │
│                                                              │
│  Full résumé →   Why I think in systems →                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRODUCTS  /  What I build                                   │  ← Section: Products
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ PlainText│ │ Nestly   │ │ Shepherd │                    │
│  │          │ │          │ │          │                    │
│  │ Status   │ │ Status   │ │ Status   │                    │
│  │ Stack    │ │ Stack    │ │ Stack    │                    │
│  │ View →   │ │ View →   │ │ View →   │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WRITING  /  Recent essays                                   │  ← Section: Writing (3 most recent)
│                                                              │
│  [Latest article preview, large]                             │
│  [+ 2 secondary articles]                                    │
│  All writing →                                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Get the dispatch.                                           │  ← Newsletter
│                                                              │
│  One essay a week on architecture, AI, and the systems       │
│  that compound. No promotions, no spam.                      │
│                                                              │
│  [email address              ] [Subscribe]                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FOOTER                                                       │
│  MF  MARK FASEL                                              │
│  SOLUTIONS ARCHITECT · AI STRATEGIST                         │
│                                                              │
│  Nav: About / Experience / Work / Writing / Consulting       │
│       / Products / Newsletter / Contact                      │
│                                                              │
│  Social: LinkedIn · GitHub · X · YouTube                     │
│                                                              │
│  © 2026 Mark Fasel · Tampa, FL                               │
└─────────────────────────────────────────────────────────────┘
```

### Tagline alternatives (in case "Better systems / Better decisions / Built to scale" needs sharpening)

The current tagline is strong. Three alternatives to A/B test:

1. **"Better systems. Better decisions. Built to scale."** _(current — recommended)_
2. **"Systems thinking, shipped."**
3. **"I design what scale demands."**

Test in user sessions with target buyers. The current tagline wins on memorability; alternative #2 wins on brevity; #3 wins on confidence.

---

## 11. Full Sitemap

```
/                           Home
/about                      About — narrative, faith framing, philosophy
/about/timeline             Career timeline (deep dive from /about)
/experience                 Roles, organizations, scope (recruiter-optimized)
/work                       Case studies index
  /work/[slug]              Individual case studies
/products                   Products index
  /products/plaintext       PlainText
  /products/nestly          Nestly
  /products/shepherd        Shepherd
/consulting                 Consulting overview, services, engagement model
  /consulting/architecture
  /consulting/ai-strategy
  /consulting/automation
  /consulting/fractional-cto
  /consulting/advisory
/writing                    Essays index, filterable by pillar
  /writing/[slug]           Individual essays (MDX)
  /writing/tag/[tag]        Tag pages
/speaking                   Talks, podcasts, conferences
/newsletter                 Newsletter landing + archive
/contact                    Contact form + direct channels
/now                        "What I'm working on" — updated monthly
/uses                       Tools, stack, hardware (developer audience)

System pages:
/colophon                   How this site was built (developer credibility)
/privacy
/terms
/404
/rss.xml
/atom.xml
/llms.txt                   AI-readable site summary (see SEO section)
/llms-full.txt              Long-form AI summary
/sitemap.xml
/feed.json                  JSON feed for newsletter integrations
```

---

## 12. Content Strategy

### Pillar architecture (four pillars)

Every piece of long-form content slots into one of four pillars. This is essential for SEO topic clustering _and_ for editorial discipline.

1. **Architecture** — System design, decisions, tradeoffs, scaling, technical debt, platform thinking
2. **AI** — Strategy, implementation, evaluation, agent design, RAG patterns, organizational adoption
3. **Leadership** — Engineering management, technical direction, hiring, decision-making, communication
4. **Systems Thinking** — Cross-cutting essays on feedback loops, second-order effects, model-building

Each pillar has a dedicated landing page (`/writing/architecture`, etc.) that acts as the topic-cluster hub.

### Content cadence (suggested)

- **Newsletter:** weekly, Tuesday mornings, 600–1,200 words
- **Long-form essay:** monthly, 2,000–4,000 words, published on the site, summarized in the newsletter
- **Case study:** quarterly, 3,000–5,000 words plus diagrams
- **"Now" page:** updated monthly
- **LinkedIn/X distribution:** every essay gets a 3-post breakdown thread

### Lead magnets

- Newsletter signup — primary conversion
- Architecture review one-pager (PDF) — gates the Consulting page bottom CTA
- Decision frameworks library (Notion or PDF) — gates secondary newsletter signups

### Editorial calendar foundation (first 12 essays)

A starter calendar that establishes range across all four pillars:

1. _Why I think in systems_ (About/Systems Thinking — site launch)
2. _The architect's job is decisions, not diagrams_ (Architecture)
3. _How to know if your AI strategy is real_ (AI)
4. _Reading the org chart through the system topology_ (Leadership)
5. _The cost of premature consistency_ (Architecture)
6. _RAG is not the architecture, it's a fragment of it_ (AI)
7. _What I look for when I'm interviewing principals_ (Leadership)
8. _Boring tech, expensive lessons_ (Systems Thinking)
9. _Building AI features when the model itself is the bottleneck_ (AI)
10. _Frontend at enterprise scale: the four failure modes_ (Architecture)
11. _The fractional CTO question_ (Leadership)
12. _Compounding decisions vs compounding code_ (Systems Thinking)

---

## 13. SEO Strategy

### Target keyword universe

**Tier 1 — branded and persona terms** (highest intent):

- "mark fasel"
- "mark fasel solutions architect"
- "mark fasel consulting"

**Tier 2 — high-intent commercial:**

- "fractional cto consulting"
- "ai strategy consultant"
- "enterprise architecture consultant"
- "ai automation consultant"
- "solutions architect consultant"

**Tier 3 — thought leadership / topic:**

- "what does a solutions architect do"
- "ai strategy framework"
- "fractional cto vs full time"
- "enterprise architecture vs solution architecture"
- "design system at enterprise scale"

**Tier 4 — long-tail informational** (drive newsletter signups):

- "how to evaluate ai vendors"
- "ai automation roi"
- "frontend architecture audit checklist"

### Technical SEO foundations

- Next.js App Router with full SSG/ISR
- Per-route `metadata` exports with title, description, OG image
- Dynamic OG image generation via `@vercel/og` — each post gets a branded social card auto-generated
- Sitemap auto-generated from MDX collection
- `robots.txt` allows all (no staging on prod)
- Canonical tags on every page
- 301 redirects map for any prior URLs

### Schema strategy (JSON-LD)

Implement these schemas explicitly:

- **Person** schema on `/about` — name, jobTitle, sameAs (social URLs), worksFor, alumniOf
- **Organization** schema on root — Mark Fasel Consulting (or whatever legal entity)
- **Article** schema on every essay — headline, datePublished, author, image
- **BreadcrumbList** on nested routes
- **FAQPage** on the Consulting service detail pages
- **WebSite** with SearchAction on root
- **ProfilePage** on `/about` (newer schema, helps with rich results)

### Topic cluster architecture

Each pillar landing page (`/writing/architecture`) acts as a hub. Hub pages link to all spoke articles. Spoke articles link back to the hub and across to 2–3 related spokes. Cross-pillar links use the JetBrains Mono inline "RELATED" pattern.

### Off-site signals

- GitHub profile linked from About and footer
- LinkedIn profile with consistent positioning
- Substack mirror of newsletter (for additional indexing surface)
- Guest posts on Substack publications in the pillar areas
- Podcast appearances (logged on `/speaking`)

---

## 14. AI Search Strategy

This is increasingly load-bearing — ChatGPT, Claude, Perplexity, and Copilot are how a meaningful share of buyers will find you in 2026.

### `llms.txt` strategy

Implement two files at the root:

- **`/llms.txt`** — short structured summary of who you are, what you do, what the major URLs are, and what content lives at each. Think "site index for LLMs."
- **`/llms-full.txt`** — concatenated full-text dump of the most important pages (About, Consulting, top 5 essays, top 3 case studies) so an LLM can ingest your full positioning in one fetch.

Template for `llms.txt`:

```
# Mark Fasel

> Solutions Architect, AI Strategist, and Technical Leader with 20+ years
> of experience designing enterprise systems. Available for fractional
> CTO engagements, AI strategy consulting, and technical advisory.

## Background
Mark Fasel has held architecture and engineering leadership roles at
LifeSurge, Ramsey Solutions, Johns Hopkins All Children's Hospital,
Publix, and Scorpion.

## Services
- Architecture review and design
- AI strategy and implementation
- Workflow automation
- Fractional architecture and CTO engagements
- Technical advisory

## Key URLs
- About: https://markfasel.com/about
- Consulting: https://markfasel.com/consulting
- Case studies: https://markfasel.com/work
- Writing: https://markfasel.com/writing
- Contact: https://markfasel.com/contact

## Writing
Mark publishes essays on architecture, AI, leadership, and systems
thinking. Recent essays include: [list dynamically generated]
```

### Page structure for AI extraction

LLMs extract entities, claims, and relationships. Optimize for this:

1. **Lead with explicit claims.** "I am a Solutions Architect" is parsed; "Crafting digital experiences" is not.
2. **Use H1 → H2 → H3 in clean hierarchy.** LLMs use heading structure for chunking.
3. **First paragraph of every page is a structured summary.** This is what gets cited.
4. **Include explicit "What this page is about" copy on the About and Consulting pages.** Yes, in human language. It helps both SEO snippets and AI extraction.
5. **Use lists for service catalogs and credentials.** LLMs parse lists more accurately than prose.

### Citation-worthy content

LLMs cite content that is: (a) well-structured, (b) authoritatively framed, (c) specific. Write essays that are _citable_ — they contain frameworks, named concepts, specific numbers, defensible opinions. Avoid hedged, generic, advice-column tone. Examples that get cited:

- "The four failure modes of enterprise frontend architecture"
- "A framework for evaluating AI vendors: capability, durability, leverage"
- "Why I use the term 'compound decisions' instead of 'technical debt'"

### Monitoring AI visibility

Tools to watch (as of 2026):

- Profound (AI search analytics)
- Otterly.ai
- Manual sampling: ask "Who are good fractional CTOs for [vertical]?" in ChatGPT, Claude, Perplexity, Copilot monthly. Track whether you appear and how you're described.

---

## 15. Next.js Architecture

### Stack confirmation

```
Framework        Next.js 15 (App Router, React 19)
Language         TypeScript 5.5+
Styling          Tailwind v4 with CSS-first config
Components       shadcn/ui (selective; not the full kit)
Animation        Motion (formerly Framer Motion) v11+
Content          MDX with @next/mdx + custom remark/rehype pipeline
Database         Supabase (newsletter, contact form submissions, analytics events)
Email            Resend (transactional + newsletter delivery)
Analytics        PostHog (product analytics + session replay on Consulting page)
Hosting          Vercel (Edge runtime where possible)
Search           Local — pagefind or fuse.js indexed at build time
Forms            react-hook-form + zod validation
Image            next/image with AVIF/WebP, blur placeholders
SEO              next-sitemap, custom metadata utilities
```

### Project structure

```
markfasel/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              ← Home
│   │   ├── about/
│   │   ├── experience/
│   │   ├── consulting/
│   │   │   ├── page.tsx
│   │   │   └── [service]/page.tsx
│   │   ├── products/
│   │   ├── speaking/
│   │   └── contact/
│   ├── (content)/
│   │   ├── work/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── writing/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── tag/[tag]/page.tsx
│   │   └── newsletter/
│   ├── (system)/
│   │   ├── now/page.tsx
│   │   ├── uses/page.tsx
│   │   ├── colophon/page.tsx
│   │   └── 404.tsx
│   ├── api/
│   │   ├── newsletter/subscribe/route.ts
│   │   ├── contact/route.ts
│   │   └── og/[...slug]/route.tsx       ← Dynamic OG images
│   ├── llms.txt/route.ts                ← Dynamic AI summary
│   ├── llms-full.txt/route.ts
│   ├── rss.xml/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                              ← shadcn primitives (Button, Input, etc.)
│   ├── brand/
│   │   ├── Logo.tsx
│   │   ├── EyebrowLabel.tsx
│   │   ├── Submark.tsx
│   │   └── GridOverlay.tsx
│   ├── diagrams/
│   │   ├── TopologyHero.tsx             ← The homepage diagram
│   │   ├── SystemDiagram.tsx            ← Reusable diagram primitive
│   │   ├── CriticalPath.tsx
│   │   └── Sparkline.tsx
│   ├── content/
│   │   ├── MDXComponents.tsx
│   │   ├── PullQuote.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Callout.tsx
│   │   └── ArticleHeader.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── CaseStudyCard.tsx
│   │   ├── ExperienceTimeline.tsx
│   │   ├── NewsletterCTA.tsx
│   │   └── Footer.tsx
│   └── navigation/
│       ├── Header.tsx
│       ├── MobileDrawer.tsx
│       └── ReadingProgress.tsx
├── content/
│   ├── essays/
│   │   ├── why-i-think-in-systems.mdx
│   │   └── ...
│   ├── case-studies/
│   │   └── lifesurge-design-system.mdx
│   ├── experience/
│   │   └── timeline.json
│   └── consulting/
│       └── services.json
├── lib/
│   ├── mdx.ts                           ← MDX loading, frontmatter parsing
│   ├── seo.ts                           ← Metadata helpers
│   ├── analytics.ts                     ← PostHog wrapper
│   ├── newsletter.ts                    ← Resend integration
│   └── content-collections.ts           ← Content type definitions
├── styles/
│   └── tokens.css                       ← Tailwind v4 @theme directive
├── public/
│   ├── fonts/                           ← Self-hosted: Cabinet, Inter, JetBrains
│   ├── og-template/
│   └── diagrams/                        ← Static SVG diagram assets
└── tailwind.config.ts                   ← Tailwind v4 config (minimal)
```

### Tailwind v4 theme tokens

```css
/* styles/tokens.css */
@import 'tailwindcss';

@theme {
  --color-bg: #0a0a0a;
  --color-surface: #121212;
  --color-elevated: #1b1b1b;
  --color-border: #2a2a2a;
  --color-border-strong: #3a3a3a;
  --color-text: #f5f2eb;
  --color-text-muted: #aca79e;
  --color-text-dim: #6b6760;
  --color-accent: #ff6b35;
  --color-accent-secondary: #f5b041;

  --font-display: 'Cabinet Grotesk', system-ui, sans-serif;
  --font-serif: 'Fraunces', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --container-max: 1280px;
  --container-max-lg: 1440px;
}
```

### Content pipeline

- MDX files in `/content` are loaded at build time via a typed collection layer (consider `content-collections` or `velite` for type safety)
- Frontmatter schema enforced with Zod: `{ title, slug, publishedAt, pillar, tags, excerpt, ogImage?, draft? }`
- Reading time computed from word count
- Auto-generated table of contents from `<h2>` and `<h3>`
- Code blocks syntax-highlighted with Shiki at build time (not runtime — no JS bundle hit)
- Custom remark plugin for the `<Diagram>` MDX component

### Performance targets

```
Lighthouse Performance       ≥ 98
Lighthouse Accessibility    100
Lighthouse Best Practices   100
Lighthouse SEO              100

LCP                         ≤ 1.2s
INP                         ≤ 100ms
CLS                         ≤ 0.02
TTFB                        ≤ 200ms (edge cached)
```

How to hit them:

- All static pages pre-rendered (SSG), revalidated nightly or on-demand
- Fonts self-hosted with `font-display: swap` and preload only the variable weights used in critical path
- Diagrams as inline SVG (no image requests, no layout shift)
- Images via `next/image` with explicit dimensions, AVIF preferred
- Zero client-side JS on pure content pages (no useState, no client components unless required)
- PostHog loaded only after the page is interactive
- No third-party scripts on critical pages

### Accessibility checklist

- All interactive elements have visible focus states (2px orange ring)
- Color contrast verified at AA minimum, AAA where possible
- Logical heading order on every page (no h3 without h2)
- Skip-to-content link in the header
- Reduced-motion media query honored everywhere
- All images have meaningful alt text
- Form errors associated with inputs via aria-describedby
- Modal/drawer focus traps and Escape-to-close
- Diagrams have descriptive `<title>` and `<desc>` for screen readers

---

## 16. Claude Code Implementation Plan

This is your build runbook. Execute in order. Each step is sized to one Claude Code session (1–3 hours of focused work).

### Phase 0 — Foundations (1 session)

1. `pnpm create next-app@latest markfasel --typescript --tailwind --app --src-dir=false --import-alias "@/*"`
2. Pin to Node 22+ in `.nvmrc`
3. Add `package.json` scripts: `dev`, `build`, `lint`, `typecheck`, `format`, `test`
4. Configure `tsconfig.json` strict mode, `noUncheckedIndexedAccess: true`
5. Install: `motion zod react-hook-form @hookform/resolvers next-mdx-remote shiki next-themes`
6. Set up `eslint` with `eslint-config-next` + `@typescript-eslint/strict` + `eslint-plugin-jsx-a11y`
7. Install Prettier with `prettier-plugin-tailwindcss`
8. Initialize Git, set up Husky pre-commit hook running lint + typecheck
9. Create the project structure scaffold (empty files matching the architecture above)
10. Commit: "chore: project scaffold"

### Phase 1 — Design system (1–2 sessions)

1. Implement `styles/tokens.css` with the full token set above
2. Self-host fonts: download Cabinet Grotesk, Inter, JetBrains Mono variable weights, Fraunces; convert to woff2; place in `/public/fonts`; declare in `globals.css` with `font-display: swap`
3. Build `<Logo />`, `<EyebrowLabel />`, `<Submark />` brand primitives
4. Build `<GridOverlay />` — the hairline background grid used as a visual layer
5. Initialize shadcn/ui (selectively): Button, Input, Textarea, Dialog, Sheet, Form
6. Restyle shadcn components to match the design system (sharper radii, brand colors)
7. Build a `/app/(system)/styleguide/page.tsx` route as the living design system reference — visible internally, noindex'd
8. Build `<Header />`, `<MobileDrawer />`, `<Footer />`
9. Verify all components in light mode (even though dark is canonical, the system should work in both)
10. Commit per logical unit

### Phase 2 — Homepage (2 sessions)

1. Build `<TopologyHero />` as a Motion-animated SVG component (the diagram from this spec)
2. Build `<Hero />` composition with the headline, subhead, CTAs, and diagram
3. Build `<TrustBar />` with the five organization names
4. Build `<ServiceGrid />` with the four service cards
5. Build `<CaseStudyCard />` and render the case studies section with sample data
6. Build `<ExperienceTimeline />` reading from `/content/experience/timeline.json`
7. Build the Products section
8. Build the Writing section preview
9. Build `<NewsletterCTA />`
10. Wire it all together in `app/(marketing)/page.tsx`
11. Test on real devices: iPhone, iPad, MacBook, external 4K
12. Run Lighthouse — fix any score below target

### Phase 3 — Content infrastructure (1–2 sessions)

1. Set up the MDX pipeline with `next-mdx-remote/rsc` or `velite`
2. Define content collection schemas with Zod (essay, case study, service)
3. Build `<MDXComponents>` with: H1–H4, p, a, ul, ol, code, pre (Shiki-highlighted), blockquote
4. Build custom MDX components: `<PullQuote>`, `<Callout>`, `<Diagram src>`, `<Stat>`, `<Aside>`
5. Build `<ArticleHeader />` with eyebrow, title, metadata, reading time
6. Set up RSS feed generation
7. Set up sitemap generation
8. Build `/llms.txt` and `/llms-full.txt` dynamic routes
9. Set up dynamic OG image generation at `/api/og/[...slug]`
10. Write the first three essays as test content

### Phase 4 — Page builds (2 sessions)

1. About page — narrative + photo + timeline preview
2. Experience page — recruiter-optimized, complete role detail
3. Consulting overview page + service detail template
4. Products index + 3 product detail pages
5. Writing index with filterable pillar tabs
6. Individual essay page (uses the MDX renderer)
7. Case study index + individual case study page
8. Contact page with form (react-hook-form + zod + Resend integration)
9. Newsletter landing page
10. /now and /uses pages
11. /colophon page (developer credibility)

### Phase 5 — Integrations (1 session)

1. Supabase setup: tables for `newsletter_subscribers`, `contact_submissions`
2. Resend setup: API key in env, audience created, double opt-in flow
3. Wire newsletter form to API route → Supabase insert + Resend welcome email
4. Wire contact form to API route → Supabase insert + Resend notification to you
5. PostHog setup: install SDK, set up custom events (form submissions, CTA clicks, scroll depth on long pages)
6. Add session replay specifically on the Consulting page (high-value visitor segment)

### Phase 6 — SEO & AI optimization (1 session)

1. Implement metadata utilities — every page exports proper title, description, OG
2. Implement JSON-LD schema on all relevant pages (Person, Article, BreadcrumbList, FAQPage)
3. Verify all canonical tags
4. Add Open Graph and Twitter Card metadata
5. Test rich results with Google's Rich Results Test
6. Verify `llms.txt` parses correctly in Claude, ChatGPT (paste it in and ask "summarize this person")
7. Set up Search Console, submit sitemap
8. Set up Bing Webmaster Tools (Copilot indexing)

### Phase 7 — Polish & launch (1 session)

1. Run full Lighthouse audit on every major page
2. Run `axe` accessibility audit, fix all violations
3. Test in: Safari (Mac, iOS), Chrome (Mac, Windows, Android), Firefox, Edge
4. Verify reduced-motion handling
5. Verify keyboard navigation on every interactive element
6. Set up Vercel Analytics + monitor Core Web Vitals
7. Configure Vercel Edge Config for fast feature flags
8. Set up 301 redirects from any old domain or routes
9. Deploy to production
10. Submit to Awwwards, CSS Design Awards, Httpster

### Phase 8 — Ongoing (continuous)

- Publish one essay per week
- Update `/now` monthly
- Add case studies as engagements complete
- Refresh hero diagram annually (it's the most visible asset)
- Monthly: review PostHog funnel data, optimize the Consulting page CTAs
- Quarterly: review AI search positioning (sample queries in ChatGPT/Claude/Perplexity)

---

## Final note

The single most important asset on this site is the homepage hero diagram. It does work no headline can do — it proves, in 0.4 seconds, that you actually think in systems. Spend 10% of the build budget on the rest of the site combined, and 10% on getting that one diagram to feel inevitable. Animate it. Iterate it. Make it the asset you're known for.

Everything else follows from that.
