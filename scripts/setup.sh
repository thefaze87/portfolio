#!/usr/bin/env bash
# scripts/setup.sh
# Scaffolds a fresh Next.js 15 + Tailwind v4 + TypeScript project for markfasel.com.
# Run from the repo root AFTER you've cleared the old src/app contents.

set -euo pipefail

echo "→ Verifying Node 22+..."
node_major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$node_major" -lt 22 ]; then
  echo "✗ Node $node_major detected. Need Node 22+."
  echo "  Install nvm and run: nvm install 22 && nvm use 22"
  exit 1
fi

echo "→ Verifying pnpm..."
if ! command -v pnpm >/dev/null 2>&1; then
  echo "✗ pnpm not found. Install with: npm install -g pnpm"
  exit 1
fi

# Pin Node version
echo "22" > .nvmrc

echo "→ Scaffolding Next.js 15..."
# Use the official create-next-app, then customize. Pipe 'no' answers for prompts we don't want.
pnpm dlx create-next-app@latest . \
  --ts \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --eslint \
  --no-turbopack \
  --skip-install \
  --yes

echo "→ Installing core dependencies..."
pnpm add \
  motion \
  zod \
  react-hook-form \
  @hookform/resolvers \
  next-mdx-remote \
  shiki \
  remark-gfm \
  rehype-slug \
  rehype-autolink-headings \
  next-themes \
  clsx \
  tailwind-merge

echo "→ Installing dev dependencies..."
pnpm add -D \
  @types/node \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-jsx-a11y \
  prettier \
  prettier-plugin-tailwindcss \
  husky \
  lint-staged

echo "→ Installing shadcn/ui CLI..."
pnpm dlx shadcn@latest init --yes --defaults --base-color neutral || \
  echo "  (shadcn init may need to be run interactively — that's fine, re-run separately if so)"

echo "→ Setting up Husky..."
pnpm dlx husky init
cat > .husky/pre-commit <<'EOF'
#!/usr/bin/env sh
pnpm lint-staged
EOF
chmod +x .husky/pre-commit

# Add lint-staged config
cat > .lintstagedrc.json <<'EOF'
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,css}": ["prettier --write"]
}
EOF

echo "→ Configuring strict TypeScript..."
# Patch tsconfig.json to enable noUncheckedIndexedAccess
node <<'EOF'
const fs = require('fs');
const path = './tsconfig.json';
const cfg = JSON.parse(fs.readFileSync(path, 'utf8'));
cfg.compilerOptions = {
  ...cfg.compilerOptions,
  strict: true,
  noUncheckedIndexedAccess: true,
  noImplicitOverride: true,
  noFallthroughCasesInSwitch: true,
};
fs.writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
EOF

echo "→ Adding package.json scripts..."
node <<'EOF'
const fs = require('fs');
const path = './package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  dev: 'next dev',
  build: 'next build',
  start: 'next start',
  lint: 'next lint',
  typecheck: 'tsc --noEmit',
  format: 'prettier --write .',
  'format:check': 'prettier --check .',
};
pkg.engines = { node: '>=22.0.0', pnpm: '>=9.0.0' };
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
EOF

echo "→ Creating directory structure..."
mkdir -p \
  "app/(marketing)" \
  "app/(content)/writing" \
  "app/(content)/work" \
  "app/(system)/styleguide" \
  "app/api" \
  components/ui \
  components/brand \
  components/diagrams \
  components/content \
  components/marketing \
  components/navigation \
  content/essays \
  content/case-studies \
  content/experience \
  content/consulting \
  lib \
  styles \
  public/fonts

echo "→ Creating styles/tokens.css placeholder..."
cat > styles/tokens.css <<'EOF'
/* Single source of truth for design tokens. */
/* All values mirror CLAUDE.md. Do not hardcode tokens anywhere else. */

@import "tailwindcss";

@theme {
  /* Color */
  --color-bg: #0A0A0A;
  --color-surface: #121212;
  --color-elevated: #1B1B1B;
  --color-border: #2A2A2A;
  --color-border-strong: #3A3A3A;
  --color-text: #F5F2EB;
  --color-text-muted: #ACA79E;
  --color-text-dim: #6B6760;
  --color-accent: #FF6B35;
  --color-accent-hover: #FF7E4F;
  --color-accent-secondary: #F5B041;

  /* Typography */
  --font-display: "Cabinet Grotesk", system-ui, sans-serif;
  --font-serif: "Fraunces", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Spacing — 4px base */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 192px;

  /* Radius — intentionally sharp */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Layout */
  --container-max: 1280px;
  --container-max-lg: 1440px;
}

/* Reset and base styles applied via globals.css, not here. */
EOF

echo "→ Replacing app/globals.css..."
cat > app/globals.css <<'EOF'
@import "../styles/tokens.css";

/* @font-face declarations go here once fonts are added to public/fonts/ */

:root {
  color-scheme: dark;
}

html {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100dvh;
  margin: 0;
}

/* Disable shadow utilities by accident */
*[class*="shadow-"] {
  /* Allowed only for focus rings — see CLAUDE.md */
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
EOF

echo "→ Replacing app/page.tsx with a smoke-test home..."
cat > app/page.tsx <<'EOF'
export default function Home() {
  return (
    <main style={{ padding: 'var(--space-9)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--color-accent)' }}>
        — REPO INITIALIZED
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, marginTop: 24, letterSpacing: '-0.025em' }}>
        Mark Fasel
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 16, maxWidth: 480, lineHeight: 1.65 }}>
        Scaffold complete. Proceed to Phase 1 in <code style={{ fontFamily: 'var(--font-mono)' }}>PLAN.md</code>.
      </p>
    </main>
  );
}
EOF

echo "→ Replacing app/layout.tsx..."
cat > app/layout.tsx <<'EOF'
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mark Fasel — Solutions Architect & AI Strategist',
  description:
    'Twenty years architecting enterprise systems. Helping leaders make better technical decisions, and building the AI and automation that compound them.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

echo "→ Creating .prettierrc..."
cat > .prettierrc <<'EOF'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF

echo "→ Creating .env.example..."
cat > .env.example <<'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
RESEND_FROM_EMAIL=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

echo ""
echo "✓ Scaffold complete."
echo ""
echo "Next steps:"
echo "  1. Verify the smoke test:  pnpm dev"
echo "  2. Read PLAN.md Phase 1."
echo "  3. Open Claude Code and paste the Phase 1 prompt from prompts.md."
echo ""
