# markfasel.dev

Personal brand and consulting site for **Mark Fasel** — Solutions Architect,
Engineering Leader, Systems Thinker, AI Strategist.

Built as a technical publication rather than a portfolio: custom diagrams over
stock imagery, editorial typography, and a design system where every color,
space, and radius resolves to a token.

---

## Stack

| Concern   | Choice                                                               |
| --------- | -------------------------------------------------------------------- |
| Framework | Next.js 16 · App Router · React 19 · Server Components by default    |
| Language  | TypeScript 5, strict, `noUncheckedIndexedAccess`                     |
| Styling   | Tailwind v4, CSS-first `@theme` in `styles/tokens.css`               |
| UI        | Hand-built primitives in `components/ui/` (no shadcn, no Radix)      |
| Forms     | react-hook-form + Zod v4 + Server Actions                            |
| Email     | Resend                                                               |
| Animation | CSS only, behind `prefers-reduced-motion`                            |
| Fonts     | Self-hosted woff2 — Cabinet Grotesk, Inter, JetBrains Mono, Fraunces |
| Hosting   | Vercel                                                               |

---

## Getting started

Requires Node 22+ and pnpm 9+.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

### Environment variables

All server-only — none are exposed to the client. See `.env.example`.

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `RESEND_API_KEY`     | Contact form delivery                              |
| `CONTACT_TO_EMAIL`   | Inbox that receives submissions                    |
| `CONTACT_FROM_EMAIL` | From address — must be on a Resend-verified domain |

Without them the site builds and runs fine; the contact form returns a generic
error and logs the missing config server-side.

---

## Scripts

```bash
pnpm dev           # dev server
pnpm build         # production build
pnpm lint          # ESLint + jsx-a11y
pnpm typecheck     # tsc --noEmit
pnpm format        # Prettier + prettier-plugin-tailwindcss
```

There is no test runner yet. See `PLAN.md` Phase F.

Run `pnpm lint && pnpm typecheck && pnpm build` before committing. Husky
enforces lint + typecheck on pre-commit.

---

## Routes

| Route         | Notes                                          |
| ------------- | ---------------------------------------------- |
| `/`           | Home                                           |
| `/experience` | Career progression and leadership record       |
| `/projects`   | Tiered project index and detailed case studies |
| `/writing`    | Technical essays                               |
| `/consulting` | Advisory and automation consulting             |
| `/about`      | Personal story, principles, and FAQ            |
| `/contact`    | Conversion page — labelled "Let's Talk" in UI  |
| `/styleguide` | Internal design-system reference · `noindex`   |

The primary navigation is Experience · Projects · Writing · Consulting · About,
with `/contact` labelled “Let's Talk.” Legacy `/work` URLs permanently redirect
to `/projects`. Opsly and TrustLaunch remain visible as Coming soon and have no
public case-study links.

---

## Design system

`/styleguide` is the contract. **Every component lands there before it lands on
a page.** It documents tokens (with computed WCAG contrast ratios), brand
primitives, buttons, form controls with their full state matrix, layout
primitives, and page-section specimens.

`styles/tokens.css` is the single source of truth. Never hardcode a color,
space, radius, or font-family in a component.

---

## Documentation

| File                    | What it is                                              |
| ----------------------- | ------------------------------------------------------- |
| `CLAUDE.md`             | Working rules, stack, brand guardrails, IA. Read first. |
| `PLAN.md`               | Forward launch roadmap                                  |
| `docs/brand-spec.md`    | Full brand and visual identity system                   |
| `docs/audit-2026-08.md` | Design, UX, IA, and engineering audit                   |
| `docs/components/`      | Logo and wordmark specs                                 |
| `docs/archive/`         | Historical — do not follow                              |

---

© Mark Fasel. Code is MIT (see `LICENSE`); brand assets, copy, and design are not.
