# Launch plan

Forward-looking roadmap. Phases 0–8 of the original build plan are complete and
have been removed — the code they describe is the code that exists. For the
assessed state of that code, see `docs/audit-2026-08.md`.

**Rule:** don't start a phase until the previous one's acceptance criteria pass.
Drift compounds.

---

## Where things stand

**Routes that render:** `/`, `/about`, `/work`, `/work/[slug]`, `/writing`,
`/writing/[slug]`, `/consulting`, `/experience`, `/contact`, `/styleguide`
(noindex), `/404`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`,
`/twitter-image`. 19 routes, all static except the styleguide.

**Nav:** matches the approved IA exactly — Work · Writing · Consulting · About,
with the Let's Talk CTA. Experience links from `/about` (ABOUT.04) and the footer.

**Design system:** tokens complete. Primitives for layout (`Container`,
`Section`, `SectionHeader`), interaction (`Button`), content (`Card`), forms
(`Field` + controls), and long-form (`ArticleHeader`, `Callout`, `PullQuote`,
`CodeBlock`, `mdxComponents`). All documented in `/styleguide`.

**Content pipeline:** wired. MDX + Zod-validated frontmatter + build-time Shiki.
Two case studies and three essays published.

**Not built:** `/products`, pillar hub routes, RSS/JSON feeds, `llms.txt`,
vertical consulting landing pages, newsletter capture on-site.

---

## Phases A–E ✅ complete

**A — Launch foundation.** Nav gating, `/contact` + Resend Server Action,
branded 404, content ordering fixes, SEO foundation, documentation truth pass,
minimum primitives.

**B — About.** Narrative, engineering + leadership philosophy, timeline preview
(carrying the `/experience` link), FAQ with schema, split CTA. Person +
ProfilePage + FAQPage JSON-LD.

**C — Content pipeline + Work.** `lib/content-schemas.ts`, `lib/mdx.ts`,
`components/content/*`, `/work` index and `/work/[slug]`, two full case studies.

**D — Writing.** `/writing` index with pillar coverage, `/writing/[slug]` with
related-by-pillar, three essays across three pillars. Article + BreadcrumbList
JSON-LD.

**E — Consulting.** Two-path entry point (Technology & Architecture Advisory ·
AI Automation for Growing Businesses), engagement model, fit/not-fit
qualification, FAQ. Two Service nodes + FAQPage JSON-LD.

### Carried forward from these phases

- **Case study metrics.** Both case studies are qualitatively true but carry no
  numbers, because none were available. Adding one hard metric each is the
  single highest-value edit available.
- **Essays need an author pass.** Drafted from principles already published on
  the site; they carry Mark's byline and must be read and edited before the
  site is promoted.
- **`SelectedWork` still sits on `/experience`.** Move it to `/work` so
  `/experience` stops doing two jobs.
- **Pillar hubs.** `/writing` shows pillar counts as labels, not links. The hub
  routes are Phase G.
- **Convert JSON content to Zod.** `career.json`, `timeline.json`, `work.json`
  are still read through unchecked `as` casts. The MDX collections show the
  pattern to follow; `timeline.json` should be derived from `career.json`.

---

## Phase F — Homepage restructure + launch QA

1. Homepage: closing `Let's Talk` CTA, newsletter capture, consulting section,
   writing preview. Currently the page ends without a conversion action.
2. Newsletter decision: stay on Substack, or own the list via Resend.
3. Fix the `/experience` portrait — 793KB `unoptimized` `priority` PNG. Remove
   `unoptimized` and verify AVIF preserves alpha. Delete
   `mark-fasel-portrait_original.png`.
4. Delete unused create-next-app assets from `/public`.
5. Full Lighthouse pass on every route against the budget in `CLAUDE.md`.
6. `axe-core` scan + manual keyboard + VoiceOver on home, about, one essay, one
   case study, contact.
7. Cross-browser: Safari (Mac + iOS), Chrome, Firefox, Edge.
8. Playwright smoke test + axe + Lighthouse budgets in CI.
9. `llms.txt` / `llms-full.txt`.
10. Search Console + Bing Webmaster. Submit sitemap.
11. Deploy. Verify metadata, OG cards, sitemap, robots in production.

---

## Phase G — Post-launch

Products page · vertical consulting landing pages · Pagefind search (~30 essays)
· PostHog · lead magnet · `/now`, `/uses`, `/colophon`, `/speaking` ·
`/privacy`, `/terms` · Supabase (only if lead history is genuinely needed).

---

## Explicitly out of scope (don't suggest)

- Dark mode toggle. Dark **is** the mode. Light mode exists in tokens for preview only.
- Internationalization. Single-language English.
- Comments on essays. Newsletter and email replies are the engagement layer.
- A CMS. File-based MDX is the system. Not Sanity, not Contentful.
- Pages router. App Router only.
- Storybook. `/styleguide` is the design system documentation.
- Animation libraries beyond Motion (no GSAP, no Lottie, no Three.js) — and
  prefer CSS over Motion.
- Email gating on the résumé. Don't gate primary content.
- reCAPTCHA / Turnstile. A third-party script on the highest-value page violates
  the performance budget. Honeypot + rate limiting is the launch answer.
