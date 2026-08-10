> **ARCHIVED — historical record only. Do not follow these instructions.**
>
> This described the one-time repo reset and Claude Code handoff that produced
> the current codebase. That reset happened; the scaffold it describes is the
> code that exists now. It is kept for provenance.
>
> Current sources of truth: `CLAUDE.md` (rules + stack), `PLAN.md` (roadmap),
> `docs/brand-spec.md` (brand), `docs/audit-2026-08.md` (state of the build).

---

# Claude Code handoff package

This bundle is the complete handoff for building **markfasel.com** in Claude Code. It assumes:

- You're on an isolated test branch of an existing Next.js repo
- You're keeping `.git` history but replacing all user-facing code
- You're using `pnpm` as the package manager
- The old project is Next.js (so most node tooling is already familiar)

## Files in this bundle

| File                      | What it is                                                                                                         | Where it goes      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `CLAUDE.md`               | Persistent context Claude Code reads every session. Stack, tokens, rules, what-this-must-not-look-like guardrails. | Repo root          |
| `PLAN.md`                 | 8-phase build plan with explicit "done when" criteria.                                                             | Repo root          |
| `prompts.md`              | Copy-paste prompts for each phase, ordered.                                                                        | Repo root          |
| `docs/components/logo.md` | Full spec for the MF monogram with SVG paths, stroke table, React component.                                       | `docs/components/` |
| `scripts/setup.sh`        | One-shot scaffold script. Run after clearing the old code.                                                         | `scripts/`         |

You'll also want to drop in the full brand spec (`markfasel-brand-and-build-spec.md` from the earlier message) at `docs/brand-spec.md`. Claude Code reads it for the longer-form content the other files reference.

## How to use this

### Step 1 — Stage the handoff files in your repo

From your repo root, on your test branch:

```bash
# Verify branch
git status
git branch --show-current

# Place the files (adjust paths to wherever you saved this bundle)
cp /path/to/handoff/CLAUDE.md .
cp /path/to/handoff/PLAN.md .
cp /path/to/handoff/prompts.md .
mkdir -p docs/components scripts
cp /path/to/handoff/docs/components/logo.md docs/components/
cp /path/to/handoff/scripts/setup.sh scripts/
chmod +x scripts/setup.sh

# Also place the brand spec (from the earlier conversation)
cp /path/to/markfasel-brand-and-build-spec.md docs/brand-spec.md

# Commit so we have a clean restore point
git add -A
git commit -m "chore: stage Claude Code handoff package"
```

### Step 2 — Phase 0: Repo reset

Read the Phase 0 section of `PLAN.md` carefully. It's the only phase you run manually — Claude Code shouldn't touch destructive `rm -rf` commands.

The condensed version:

```bash
# Preserve anything worth keeping
mkdir -p .preserved
cp -r .github .preserved/ 2>/dev/null || true
cp .env.local .preserved/ 2>/dev/null || true
cp .env.example .preserved/ 2>/dev/null || true
[ -f README.md ] && cp README.md .preserved/

# Snapshot the current state in git so you can recover
git add -A && git commit -m "chore: snapshot before reset" --allow-empty

# Clear app code. Be selective — review this list against your repo.
rm -rf app pages src components lib styles public package.json pnpm-lock.yaml yarn.lock package-lock.json node_modules .next next.config.* tailwind.config.* postcss.config.* tsconfig.json

# Re-stage the handoff files (the rm may have eaten them depending on order)
git checkout HEAD -- CLAUDE.md PLAN.md prompts.md docs scripts

# Run scaffold
bash scripts/setup.sh

# Restore preserved items
cp -r .preserved/.github . 2>/dev/null || true
cp .preserved/.env.local . 2>/dev/null || true
rm -rf .preserved

# Verify smoke test
pnpm dev
# Visit http://localhost:3000 — you should see the "REPO INITIALIZED" page

# Commit the scaffold
git add -A
git commit -m "chore: scaffold next.js 15 + tailwind v4"
```

### Step 3 — Hand off to Claude Code

Open Claude Code in the repo root. The first thing you say:

> Read CLAUDE.md, PLAN.md, and docs/brand-spec.md in full. Confirm when you're done. Then I'll give you the Phase 1 prompt.

Once it confirms, paste the **Phase 1 prompt** from `prompts.md`.

### Step 4 — Run the phases sequentially

After each phase, verify acceptance criteria from `PLAN.md` yourself. Don't skip this. If something fails, fix it before moving to the next phase — drift compounds.

Between phases, commit cleanly:

```bash
git add -A
git commit -m "feat: phase N — <summary>"
```

## Why this structure works

1. **`CLAUDE.md` survives context resets.** Whether you're in one long Claude Code session or coming back tomorrow, this file is the brain.

2. **`PLAN.md` makes acceptance objective.** No phase is "done because Claude said so." Every phase has explicit, verifiable criteria.

3. **`prompts.md` removes prompt-engineering tax at midnight.** You don't have to remember how to phrase Phase 5. It's already written.

4. **Styleguide-first discipline.** Every component lands in `/styleguide` before a real page. This is what prevents the homepage looking great and inner pages looking like a different site — the typical drift mode.

5. **One source of truth per concern.** Tokens live in `styles/tokens.css`. Brand rules live in `CLAUDE.md`. Build order lives in `PLAN.md`. Component specs live in `docs/components/`. Claude Code doesn't have to choose between conflicting sources.

## The single most important rule, restated

**Build the styleguide first and reference it constantly.** Every component lands in `/styleguide` before it lands on a real page. The styleguide is the contract. If you skip this, the homepage will look great and the inner pages will look like a different site. That is the failure mode this entire structure exists to prevent.
