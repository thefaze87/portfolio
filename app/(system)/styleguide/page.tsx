import Link from 'next/link';
import { contrastRatio, formatRatio, wcagGrade, type WcagGrade } from '@/lib/contrast';
import { EyebrowLabel } from '@/components/brand/EyebrowLabel';
import { GridOverlay } from '@/components/brand/GridOverlay';
import { Logo, type LogoVariant } from '@/components/brand/Logo';
import { Submark, type SubmarkName } from '@/components/brand/Submark';
import { Wordmark, type WordmarkSize } from '@/components/brand/Wordmark';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { RoleLine } from '@/components/navigation/RoleLine';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { TopologyHero } from '@/components/diagrams/TopologyHero';
import { TrustBar } from '@/components/marketing/TrustBar';
import { HeroMasthead } from '@/components/marketing/HeroMasthead';
import { ArchitecturePhilosophy } from '@/components/marketing/ArchitecturePhilosophy';
import { ExperienceTimeline } from '@/components/marketing/ExperienceTimeline';
import { IndustriesGrid } from '@/components/marketing/IndustriesGrid';
import { ExperienceMore } from '@/components/marketing/ExperienceMore';
import { NAV_LINKS } from '@/lib/nav';

/* ============================================================================
 * Token registries
 *
 * Static tables, declared once at module scope. The styleguide reads from
 * these rather than introspecting the CSS at runtime, so any drift between
 * styles/tokens.css and this file is immediately visible (a swatch goes
 * black, a type row collapses, etc.). When you add a token to tokens.css,
 * add it here too.
 * ========================================================================== */

const BG_HEX = '#0a0a0a';

type ColorToken = {
  group: 'Surfaces' | 'Borders' | 'Text' | 'Accent' | 'Status';
  name: string;
  hex: string;
  note?: string;
};

const COLOR_TOKENS: readonly ColorToken[] = [
  { group: 'Surfaces', name: 'bg', hex: '#0a0a0a', note: 'page canvas' },
  { group: 'Surfaces', name: 'surface', hex: '#121212', note: 'cards, inputs' },
  { group: 'Surfaces', name: 'elevated', hex: '#1b1b1b', note: 'modals, popovers' },
  { group: 'Borders', name: 'border', hex: '#2a2a2a', note: 'default 1px' },
  { group: 'Borders', name: 'border-strong', hex: '#3a3a3a', note: 'emphasis' },
  { group: 'Text', name: 'text', hex: '#f5f2eb', note: 'primary body' },
  { group: 'Text', name: 'text-muted', hex: '#aca79e', note: 'secondary' },
  { group: 'Text', name: 'text-dim', hex: '#6b6760', note: '≥18pt only · ambient metadata' },
  { group: 'Accent', name: 'accent', hex: '#ff6b35', note: 'one per viewport' },
  { group: 'Accent', name: 'accent-hover', hex: '#ff7e4f', note: 'intensify on hover' },
  { group: 'Accent', name: 'accent-secondary', hex: '#f5b041', note: 'sparingly' },
  { group: 'Status', name: 'success', hex: '#5ba378' },
  { group: 'Status', name: 'warning', hex: '#f5b041' },
  { group: 'Status', name: 'danger', hex: '#d85a30' },
  { group: 'Status', name: 'info', hex: '#6b92c9' },
];

type TypeToken = {
  name: string;
  family: 'serif' | 'display' | 'sans' | 'mono';
  mobile: string;
  desktop: string;
  sample: string;
  className: string;
};

const TYPE_TOKENS: readonly TypeToken[] = [
  {
    name: 'display-xl',
    family: 'serif',
    mobile: '48 / 0.95',
    desktop: '88 / 0.92',
    sample: 'Better systems.',
    className: 'type-display-xl',
  },
  {
    name: 'display-lg',
    family: 'display',
    mobile: '36 / 1.0',
    desktop: '64 / 0.95',
    sample: 'What I do.',
    className: 'type-display-lg',
  },
  {
    name: 'display-md',
    family: 'display',
    mobile: '28 / 1.05',
    desktop: '44 / 1.0',
    sample: 'Selected engagements',
    className: 'type-display-md',
  },
  {
    name: 'h1',
    family: 'display',
    mobile: '26 / 1.15',
    desktop: '36 / 1.1',
    sample: 'Twenty years, condensed.',
    className: 'type-h1',
  },
  {
    name: 'h2',
    family: 'display',
    mobile: '22 / 1.2',
    desktop: '28 / 1.15',
    sample: 'Compounding decisions',
    className: 'type-h2',
  },
  {
    name: 'h3',
    family: 'display',
    mobile: '18 / 1.3',
    desktop: '20 / 1.25',
    sample: 'Architecture & AI Strategy',
    className: 'type-h3',
  },
  {
    name: 'body-lg',
    family: 'sans',
    mobile: '17 / 1.6',
    desktop: '19 / 1.65',
    sample:
      '20+ years architecting enterprise systems. Helping leaders make better technical decisions, and building the AI and automation that compound them.',
    className: 'type-body-lg',
  },
  {
    name: 'body',
    family: 'sans',
    mobile: '15 / 1.65',
    desktop: '16 / 1.7',
    sample:
      'I design what scale demands. Default to the option that reads as a publication rather than a product.',
    className: 'type-body',
  },
  {
    name: 'body-sm',
    family: 'sans',
    mobile: '14 / 1.6',
    desktop: '14 / 1.6',
    sample: 'Reduced incident MTTR from 4hrs to 22min across 14 services.',
    className: 'type-body-sm',
  },
  {
    name: 'mono-label',
    family: 'mono',
    mobile: '11 / 1.4',
    desktop: '11 / 1.4',
    sample: 'FIG 01 · TOPOLOGY · 4L · 12N',
    className: 'type-mono-label',
  },
  {
    name: 'mono-body',
    family: 'mono',
    mobile: '14 / 1.6',
    desktop: '14 / 1.6',
    sample: 'const ratio = contrastRatio(token.hex, BG_HEX);',
    className: 'type-mono-body',
  },
];

type SpaceToken = { name: string; px: number };
const SPACE_TOKENS: readonly SpaceToken[] = [
  { name: 'space-1', px: 4 },
  { name: 'space-2', px: 8 },
  { name: 'space-3', px: 12 },
  { name: 'space-4', px: 16 },
  { name: 'space-5', px: 24 },
  { name: 'space-6', px: 32 },
  { name: 'space-7', px: 48 },
  { name: 'space-8', px: 64 },
  { name: 'space-9', px: 96 },
  { name: 'space-10', px: 128 },
  { name: 'space-11', px: 192 },
];

type RadiusToken = { name: string; value: string; usage: string };
const RADIUS_TOKENS: readonly RadiusToken[] = [
  { name: 'radius-xs', value: '2px', usage: 'buttons, badges, code' },
  { name: 'radius-sm', value: '4px', usage: 'cards, inputs' },
  { name: 'radius-md', value: '8px', usage: 'large cards, modals' },
  { name: 'radius-lg', value: '12px', usage: 'featured blocks' },
  { name: 'radius-full', value: '9999px', usage: 'avatars only' },
];

type StrokeToken = { name: string; value: string; usage: string };
const STROKE_TOKENS: readonly StrokeToken[] = [
  { name: 'stroke-hairline', value: '0.5px', usage: 'grid lines, technical drawings, dividers' },
  { name: 'stroke-thin', value: '1px', usage: 'standard borders' },
  { name: 'stroke-medium', value: '1.5px', usage: 'diagram arrows, emphasis borders' },
  { name: 'stroke-thick', value: '2px', usage: 'active states, focus rings only' },
];

/* ============================================================================
 * Helpers
 * ========================================================================== */

function gradeChipStyles(grade: WcagGrade): { bg: string; fg: string } {
  switch (grade) {
    case 'AAA':
      return { bg: 'var(--color-success)', fg: 'var(--color-bg)' };
    case 'AA':
      return { bg: 'var(--color-info)', fg: 'var(--color-bg)' };
    case 'AA Large':
      return { bg: 'var(--color-warning)', fg: 'var(--color-bg)' };
    case 'fail':
      return { bg: 'var(--color-danger)', fg: 'var(--color-bg)' };
  }
}

function groupBy<T, K extends string>(items: readonly T[], key: (t: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k) ?? [];
    list.push(item);
    map.set(k, list);
  }
  return map;
}

/* ============================================================================
 * Page
 * ========================================================================== */

type StyleguidePageProps = {
  searchParams: Promise<{ grid?: string }>;
};

export default async function StyleguidePage({ searchParams }: StyleguidePageProps) {
  const { grid } = await searchParams;
  const showGrid = grid === '1';

  return (
    <>
      {showGrid && <GridOverlay accent />}

      <main
        id="main-content"
        className="mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--space-9)',
        }}
      >
        {/* ------------------------------------------------------------------
         * Header
         * ----------------------------------------------------------------- */}
        <header style={{ marginBottom: 'var(--space-10)' }}>
          <EyebrowLabel>Styleguide · Internal · Phase 6</EyebrowLabel>
          <h1 className="type-display-lg" style={{ marginTop: 'var(--space-5)', maxWidth: '32ch' }}>
            Design system tokens.
          </h1>
          <p
            className="type-body-lg"
            style={{
              marginTop: 'var(--space-5)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            The single source of truth for color, type, space, radius, and stroke. Every component
            on the site resolves to a value declared here. If a value is missing from this page, it
            does not exist yet.
          </p>

          <nav
            aria-label="Grid overlay toggle"
            style={{
              marginTop: 'var(--space-6)',
              display: 'flex',
              gap: 'var(--space-4)',
              alignItems: 'center',
            }}
          >
            <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
              12-col grid:
            </span>
            <Link
              href="/styleguide?grid=1"
              prefetch={false}
              className="type-mono-label"
              style={{
                color: showGrid ? 'var(--color-accent)' : 'var(--color-text)',
                textDecoration: 'underline',
                textUnderlineOffset: 'var(--space-1)',
              }}
            >
              Show
            </Link>
            <Link
              href="/styleguide"
              prefetch={false}
              className="type-mono-label"
              style={{
                color: showGrid ? 'var(--color-text)' : 'var(--color-accent)',
                textDecoration: 'underline',
                textUnderlineOffset: 'var(--space-1)',
              }}
            >
              Hide
            </Link>
          </nav>
        </header>

        {/* ------------------------------------------------------------------
         * Color
         * ----------------------------------------------------------------- */}
        <Section title="Color" index="01">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Contrast ratios computed against{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              --color-bg
            </code>{' '}
            (#0a0a0a) using the WCAG 2.2 relative-luminance formula. Status pill marks the strongest
            grade the ratio satisfies for normal text.
          </p>

          {Array.from(groupBy(COLOR_TOKENS, (c) => c.group)).map(([group, tokens]) => (
            <div key={group} style={{ marginBottom: 'var(--space-8)' }}>
              <h3
                className="type-mono-label"
                style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
              >
                {group}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 'var(--space-5)',
                }}
              >
                {tokens.map((token) => (
                  <ColorSwatch key={token.name} token={token} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* ------------------------------------------------------------------
         * Type
         * ----------------------------------------------------------------- */}
        <Section title="Type" index="02">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Eleven scale steps across four families. Fraunces (serif) is reserved for the homepage
            hero only. Mobile/desktop columns show responsive sizing in{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              px / line-height
            </code>{' '}
            notation.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-7)',
            }}
          >
            {TYPE_TOKENS.map((token) => (
              <TypeRow key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------
         * Spacing
         * ----------------------------------------------------------------- */}
        <Section title="Spacing" index="03">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            4px base. Use these tokens; do not invent intermediate values. If a layout needs 20px,
            it needs 16px or 24px.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {SPACE_TOKENS.map((token) => (
              <SpaceRow key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------
         * Radius
         * ----------------------------------------------------------------- */}
        <Section title="Radius" index="04">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Intentionally sharper than 2023 conventions. 2px buttons signal precision; reach for
            <code
              className="type-mono-body"
              style={{ color: 'var(--color-text)' }}
            >{` rounded-xl `}</code>
            and you are probably wrong.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
            }}
          >
            {RADIUS_TOKENS.map((token) => (
              <RadiusTile key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------
         * Stroke weights
         * ----------------------------------------------------------------- */}
        <Section title="Stroke" index="05">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            For borders and SVG diagrams. There are no shadows in this system; depth comes from
            background layering plus hairline borders at varying opacities.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}
          >
            {STROKE_TOKENS.map((token) => (
              <StrokeRow key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------------------
         * Brand primitives — built in Phase 2.
         * Each component gets its own numbered section per styleguide-first
         * rule (CLAUDE.md): a component lands here before being used anywhere
         * else on the site.
         * ----------------------------------------------------------------- */}

        {/* §06 Wordmark */}
        <Section title="Wordmark" index="06">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Cabinet Grotesk Medium 500, uppercase, 0.16em tracking. Single weight — no light/bold
            split, no title case (both explored and rejected). Three sizes (sm/md/lg), two color
            variants (default / accent). Always sized smaller than the mark so the mark stays the
            hero. The mono role line{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              SOLUTIONS ARCHITECT · AI STRATEGIST
            </code>{' '}
            lives in the footer lockup (§10), not the wordmark itself.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <WordmarkTile key={s} size={s} />
            ))}
          </div>
        </Section>

        {/* §07 EyebrowLabel */}
        <Section title="EyebrowLabel" index="07">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Mono-label treatment with a 24px (
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              --space-5
            </code>
            ) leading orange divider. The divider color is always{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              --color-accent
            </code>{' '}
            — even when the label text is muted — because the divider is the brand cue, not a
            function of the label&apos;s emphasis.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            <EyebrowTile caption="accent · divider">
              <EyebrowLabel>Selected engagement</EyebrowLabel>
            </EyebrowTile>
            <EyebrowTile caption="muted · divider">
              <EyebrowLabel accent={false}>Filed under architecture</EyebrowLabel>
            </EyebrowTile>
            <EyebrowTile caption="accent · no divider">
              <EyebrowLabel divider={false}>Case study · 2024</EyebrowLabel>
            </EyebrowTile>
          </div>
        </Section>

        {/* §08 Submark */}
        <Section title="Submark" index="08">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Four monoline glyphs that sit beside page titles and section openers, reinforcing the
            &ldquo;person who draws systems&rdquo; voice. 24×24 viewBox, 1.5px stroke, inherits text
            color via{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              currentColor
            </code>
            . Orange accents on{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              layers
            </code>{' '}
            and{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              compass
            </code>{' '}
            mark the critical edge / north arm respectively.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
              gap: 'var(--space-5)',
              maxWidth: 720,
            }}
          >
            {(['topology', 'layers', 'cube', 'compass'] as const).map((n) => (
              <SubmarkTile key={n} name={n} />
            ))}
          </div>
        </Section>

        {/* §09 GridOverlay */}
        <Section title="GridOverlay" index="09">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            Fixed-position 12-column orthographic grid. Two modes: <em>accent</em> (strong orange
            hairlines, opt-in via{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              ?grid=1
            </code>
            ) and <em>ambient</em> (0.5px text-tone hairlines, sit behind content as part of the
            brand&apos;s visual language). Use the toggle in this page&apos;s header to flip the
            accent mode. Column count is locked to 12 — not configurable.
          </p>
          <GridOverlayPreview />
        </Section>

        {/* §10 Mark — the brand mark + lockups */}
        <Section title="Mark" index="10">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            The Mark Fasel mark — two flowing ribbon slashes ascending left-to-right plus a solid
            triangular elevation peak. An abstract systems/elevation symbol that secondarily reads
            as MF; deliberately not a letterform monogram. A single compound SVG path,{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              currentColor
            </code>
            -driven, landscape ~1.374:1.{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              height
            </code>{' '}
            drives size; width derives from the aspect ratio.
          </p>

          {/* Colorways */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Three colorways
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-5)',
                maxWidth: 760,
              }}
            >
              {(
                [
                  {
                    variant: 'default',
                    caption: 'default · white · var(--color-text)',
                    background: 'var(--color-surface)',
                  },
                  {
                    variant: 'dark',
                    caption: 'dark · #0A0A0A · on light',
                    background: 'var(--color-text)',
                  },
                  {
                    variant: 'accent',
                    caption: 'accent · orange · var(--color-accent)',
                    background: 'var(--color-surface)',
                  },
                ] satisfies { variant: LogoVariant; caption: string; background: string }[]
              ).map((c) => (
                <ColorwayTile key={c.variant} caption={c.caption} background={c.background}>
                  <Logo height={56} variant={c.variant} />
                </ColorwayTile>
              ))}
            </div>
          </div>

          {/* Size range */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Size range — by height
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 'var(--space-7)',
                padding: 'var(--space-6)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                flexWrap: 'wrap',
              }}
            >
              {[16, 24, 32, 48, 72, 120].map((h) => (
                <div
                  key={h}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                  }}
                >
                  <Logo height={h} />
                  <span
                    className="type-mono-label nums-tabular"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {h}px
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Square avatar */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Square avatar
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center' }}>
              <div
                aria-hidden="true"
                style={{
                  width: 'var(--space-10)',
                  height: 'var(--space-10)',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: 'var(--stroke-hairline) solid var(--color-border)',
                }}
              >
                <Logo height={48} variant="default" />
              </div>
              <span
                className="type-body-sm"
                style={{ color: 'var(--color-text-muted)', maxWidth: '40ch' }}
              >
                White mark centered on the #0A0A0A square. Shipped asset:{' '}
                <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
                  public/brand/mark-avatar-square.svg
                </code>{' '}
                — used for LinkedIn / GitHub avatars.
              </span>
            </div>
          </div>

          {/* Lockups */}
          <div>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Lockups
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-5)',
                maxWidth: 760,
              }}
            >
              <LockupTile caption="horizontal · mark + wordmark (reduced)">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Logo height={28} />
                  <Wordmark size="sm" />
                </div>
              </LockupTile>
              <LockupTile caption="footer lockup · role line as its own block">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Logo height={28} />
                    <Wordmark size="sm" />
                  </div>
                  <RoleLine />
                </div>
              </LockupTile>
            </div>
          </div>
        </Section>

        {/* §11 Navigation */}
        <Section title="Navigation" index="11">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            The Header (mark-only, sticky) and Footer (full lockup + role line) wrap every page via
            the root layout — they are <strong style={{ color: 'var(--color-text)' }}>live</strong>{' '}
            at the top and bottom of this page. They are not re-rendered here as isolated specimens:
            duplicating their{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              banner
            </code>{' '}
            /{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              contentinfo
            </code>{' '}
            landmarks on one page is an accessibility violation. The two contextual pieces below are
            shown as specimens.
          </p>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Mobile drawer
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-5)',
                padding: 'var(--space-6)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <MobileDrawer links={NAV_LINKS} />
              <span
                className="type-body-sm"
                style={{ color: 'var(--color-text-muted)', maxWidth: '52ch' }}
              >
                In the header this trigger renders below 768px. Opening it mounts a focus-trapped,
                scroll-locked full-screen dialog: Tab cycles within the panel, Escape closes, and
                focus returns to the trigger. 22px sans nav items, mono role line, topology submark
                at the foot. Click the icon to preview.
              </span>
            </div>
          </div>

          <div>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Reading progress
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                padding: 'var(--space-6)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <ReadingProgressPreview />
              <span
                className="type-body-sm"
                style={{ color: 'var(--color-text-muted)', maxWidth: '52ch' }}
              >
                Left-gutter indicator for long content pages — opt-in per page, shown only ≥1440px.
                Tracks scroll position and the active section heading. Static preview here; the live
                component is fixed to the left gutter, so it only appears on wide content routes.
              </span>
            </div>
          </div>
        </Section>

        {/* §12 Hero system */}
        <Section title="Hero system" index="12">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            The above-the-fold system: the{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              TopologyHero
            </code>{' '}
            diagram, the primary/secondary CTAs, and the trust bar. The full composition is live at{' '}
            <Link
              href="/"
              prefetch={false}
              style={{
                color: 'var(--color-text)',
                textDecoration: 'underline',
                textUnderlineOffset: 'var(--space-1)',
              }}
            >
              the homepage
            </Link>
            . It isn&apos;t re-rendered whole here (a second hero{' '}
            <code className="type-mono-body" style={{ color: 'var(--color-text)' }}>
              {'<h1>'}
            </code>{' '}
            would muddy the page outline); the parts are shown as specimens.
          </p>

          {/* Topology — dark + light */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Critical-path topology · default + light
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-5)',
              }}
            >
              <div
                style={{
                  padding: 'var(--space-6)',
                  border: 'var(--stroke-hairline) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <TopologyHero />
              </div>
              {/* Light-mode preview: flips the tokens within this subtree only. */}
              <div
                data-mode="light"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  padding: 'var(--space-6)',
                  border: 'var(--stroke-hairline) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <TopologyHero />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Hero CTAs
            </h3>
            <div className="flex flex-wrap" style={{ gap: 'var(--space-4)', alignItems: 'center' }}>
              <span
                className="cta-primary type-body inline-flex items-center justify-center"
                style={{ padding: 'var(--space-4) var(--space-6)' }}
              >
                View Experience
              </span>
              <span
                className="cta-ghost type-body inline-flex items-center justify-center"
                style={{ padding: 'var(--space-4) var(--space-6)' }}
              >
                Let&apos;s Talk
              </span>
              <span className="type-body-sm" style={{ color: 'var(--color-text-muted)' }}>
                primary (the one orange interactive element) + ghost secondary
              </span>
            </div>
          </div>

          {/* Trust bar */}
          <div>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Trust bar
            </h3>
            <div
              style={{
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              <TrustBar />
            </div>
          </div>
        </Section>

        {/* §13 Architecture system — masthead, section labels, philosophy */}
        <Section title="Architecture system" index="13">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            The premium-journal layer: reusable section labels, the hero masthead backdrop, and the
            architecture-philosophy section. The masthead is live behind the homepage hero; the
            philosophy section is live on the homepage below the trust bar.
          </p>

          {/* Section labels */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Section labels
            </h3>
            <div className="flex flex-wrap" style={{ gap: 'var(--space-4) var(--space-7)' }}>
              {['ARCH.01', 'ARCH.02', 'CASE.01', 'CASE.02', 'THINK.01', 'THINK.02'].map((l) => (
                <SectionLabel key={l}>{l}</SectionLabel>
              ))}
              <SectionLabel accent>ARCH.01</SectionLabel>
            </div>
          </div>

          {/* Masthead preview */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Hero masthead — drafting grid · ghost wordmark · blueprint overlay
            </h3>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                height: 'var(--space-11)',
                background: 'var(--color-bg)',
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <HeroMasthead />
            </div>
          </div>

          {/* Philosophy section */}
          <div>
            <h3
              className="type-mono-label"
              style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-5)' }}
            >
              Philosophy section
            </h3>
            <div
              style={{
                border: 'var(--stroke-hairline) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              <ArchitecturePhilosophy />
            </div>
          </div>
        </Section>

        {/* §14 Experience system — timeline + industries */}
        <Section title="Experience system" index="14">
          <p
            className="type-body"
            style={{
              marginBottom: 'var(--space-7)',
              color: 'var(--color-text-muted)',
              maxWidth: '60ch',
            }}
          >
            EXP.01 (timeline) and EXP.02 (industries), live on the homepage below the philosophy
            section.
          </p>

          <div
            style={{
              marginBottom: 'var(--space-7)',
              padding: '0 var(--space-2)',
              border: 'var(--stroke-hairline) solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <p
              className="type-body-sm"
              style={{
                color: 'var(--color-text-muted)',
                padding: 'var(--space-4)',
                margin: 0,
                maxWidth: '70ch',
              }}
            >
              <strong style={{ color: 'var(--color-text)' }}>Timeline usage rules.</strong>{' '}
              Editorial, not a résumé. Desktop alternates entries left/right of a centered rail;
              mobile is a single left-rail column — text stays left-aligned in both. Exactly one
              node is orange: the current role (top entry). No logos, photos, gradients, glow, or
              decorative animation. Order conveys recency; date ranges are optional per entry.
            </p>
          </div>

          <div
            style={{
              border: 'var(--stroke-hairline) solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: 'var(--space-6)',
            }}
          >
            <ExperienceTimeline />
          </div>
          <div
            style={{
              border: 'var(--stroke-hairline) solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: 'var(--space-6)',
            }}
          >
            <IndustriesGrid />
          </div>
          <div
            style={{
              border: 'var(--stroke-hairline) solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <ExperienceMore />
          </div>
        </Section>

        <footer
          style={{
            marginTop: 'var(--space-10)',
            paddingTop: 'var(--space-7)',
            borderTop: '0.5px solid var(--color-border)',
          }}
        >
          <p className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
            Mark Fasel · Phase 6 · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}

/* ============================================================================
 * Local components
 * ========================================================================== */

function Section({
  title,
  index,
  children,
}: {
  title: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: 'var(--space-10)',
        paddingTop: 'var(--space-8)',
        borderTop: '0.5px solid var(--color-border)',
      }}
    >
      <header style={{ marginBottom: 'var(--space-7)' }}>
        <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
          §{index}
        </span>
        <h2 className="type-display-md" style={{ marginTop: 'var(--space-2)' }}>
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function ColorSwatch({ token }: { token: ColorToken }) {
  const isBg = token.hex.toLowerCase() === BG_HEX;
  const ratio = isBg ? null : contrastRatio(token.hex, BG_HEX);
  const grade = ratio !== null ? wcagGrade(ratio) : null;
  const chip = grade ? gradeChipStyles(grade) : null;
  const isSurface = token.group === 'Surfaces';

  /* Swatch = pure color block. Metadata sits below it on --color-bg (not
   * on a card surface), so every text node has the strongest possible
   * contrast with its ancestor. Surface tokens get an inline body-text
   * sample so the reader sees the surface in its actual use context;
   * --color-text on any --color-surface tier still clears 14:1. */
  return (
    <div>
      <div
        style={{
          background: token.hex,
          height: 'var(--space-10)',
          borderRadius: 'var(--radius-sm)',
          border: '0.5px solid var(--color-border)',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'flex-end',
        }}
        aria-hidden={isSurface ? undefined : 'true'}
      >
        {isSurface && (
          <p className="type-body-sm" style={{ color: 'var(--color-text)', margin: 0 }}>
            Sample of body text on this surface.
          </p>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <div className="type-mono-label" style={{ color: 'var(--color-text)' }}>
          --color-{token.name}
        </div>
        <div
          className="type-mono-body nums-tabular"
          style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}
        >
          {token.hex.toUpperCase()}
        </div>
        {token.note && (
          <div
            className="type-body-sm"
            style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}
          >
            {token.note}
          </div>
        )}
        <div
          style={{
            marginTop: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          {ratio !== null && chip && grade ? (
            <>
              <span className="type-mono-label nums-tabular" style={{ color: 'var(--color-text)' }}>
                {formatRatio(ratio)}
              </span>
              <span
                className="type-mono-label nums-tabular"
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  background: chip.bg,
                  color: chip.fg,
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {grade}
              </span>
            </>
          ) : (
            <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
              background reference
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeRow({ token }: { token: TypeToken }) {
  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 220px) 1fr',
        gap: 'var(--space-5)',
        alignItems: 'baseline',
        paddingBottom: 'var(--space-6)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <header>
        <div className="type-mono-label" style={{ color: 'var(--color-accent)' }}>
          {token.name}
        </div>
        <div
          className="type-mono-body nums-tabular"
          style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}
        >
          {token.family}
        </div>
        <div
          className="type-mono-body nums-tabular"
          style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}
        >
          sm {token.mobile}
          {'  '}lg {token.desktop}
        </div>
      </header>
      <p className={token.className} style={{ margin: 0 }}>
        {token.sample}
      </p>
    </article>
  );
}

function SpaceRow({ token }: { token: SpaceToken }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 80px 1fr',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <span className="type-mono-label" style={{ color: 'var(--color-text)' }}>
        --{token.name}
      </span>
      <span className="type-mono-body nums-tabular" style={{ color: 'var(--color-text-muted)' }}>
        {token.px}px
      </span>
      <div
        aria-hidden="true"
        style={{
          width: `var(--${token.name})`,
          height: 'var(--space-3)',
          background: 'var(--color-accent)',
        }}
      />
    </div>
  );
}

function RadiusTile({ token }: { token: RadiusToken }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        width: 'var(--space-9)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 'var(--space-9)',
          height: 'var(--space-9)',
          background: 'var(--color-elevated)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: `var(--${token.name})`,
        }}
      />
      <span className="type-mono-label" style={{ color: 'var(--color-text)' }}>
        --{token.name}
      </span>
      <span className="type-mono-body nums-tabular" style={{ color: 'var(--color-text-muted)' }}>
        {token.value}
      </span>
      <span className="type-body-sm" style={{ color: 'var(--color-text-muted)' }}>
        {token.usage}
      </span>
    </div>
  );
}

function StrokeRow({ token }: { token: StrokeToken }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 80px 1fr 1fr',
        alignItems: 'center',
        gap: 'var(--space-5)',
      }}
    >
      <span className="type-mono-label" style={{ color: 'var(--color-text)' }}>
        --{token.name}
      </span>
      <span className="type-mono-body nums-tabular" style={{ color: 'var(--color-text-muted)' }}>
        {token.value}
      </span>
      <div
        aria-hidden="true"
        style={{
          height: token.value,
          background: 'var(--color-text)',
        }}
      />
      <span className="type-body-sm" style={{ color: 'var(--color-text-muted)' }}>
        {token.usage}
      </span>
    </div>
  );
}

/* ============================================================================
 * Brand primitive tiles (Phase 2)
 * ========================================================================== */

function PrimitiveFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        border: 'var(--stroke-hairline) solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {children}
    </div>
  );
}

function WordmarkTile({ size }: { size: WordmarkSize }) {
  return (
    <PrimitiveFrame>
      <Wordmark size={size} />
      <Wordmark size={size} variant="accent" />
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        size={size} · default + accent
      </span>
    </PrimitiveFrame>
  );
}

function EyebrowTile({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <PrimitiveFrame>
      <div style={{ minHeight: 'var(--space-7)', display: 'flex', alignItems: 'center' }}>
        {children}
      </div>
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        {caption}
      </span>
    </PrimitiveFrame>
  );
}

function SubmarkTile({ name }: { name: SubmarkName }) {
  return (
    <PrimitiveFrame>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-4)',
          color: 'var(--color-text)',
        }}
      >
        <Submark name={name} size={16} aria-label={`${name} 16px`} />
        <Submark name={name} size={24} aria-label={`${name} 24px`} />
      </div>
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        {name} · 16 / 24
      </span>
    </PrimitiveFrame>
  );
}

function ColorwayTile({
  caption,
  background,
  children,
}: {
  caption: string;
  background: string;
  children: React.ReactNode;
}) {
  return (
    <PrimitiveFrame>
      <div
        style={{
          minHeight: 'var(--space-10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background,
          borderRadius: 'var(--radius-xs)',
          padding: 'var(--space-5)',
        }}
      >
        {children}
      </div>
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        {caption}
      </span>
    </PrimitiveFrame>
  );
}

/**
 * Static visual replica of the ReadingProgress indicator. The live
 * component is fixed-position and ≥1440px-only, so it can't be shown inline;
 * this mirrors its appearance (percentage, vertical track + fill, section
 * label) for documentation.
 */
function ReadingProgressPreview() {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
    >
      <span className="type-mono-label nums-tabular" style={{ color: 'var(--color-accent)' }}>
        37%
      </span>
      <div
        style={{
          position: 'relative',
          width: 'var(--stroke-thick)',
          height: 'var(--space-10)',
          background: 'var(--color-border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            top: 0,
            height: '37%',
            background: 'var(--color-accent)',
          }}
        />
      </div>
      <span
        className="type-mono-label"
        style={{ color: 'var(--color-text-muted)', writingMode: 'vertical-rl' }}
      >
        Architecture
      </span>
    </div>
  );
}

function LockupTile({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <PrimitiveFrame>
      <div style={{ minHeight: 'var(--space-9)', display: 'flex', alignItems: 'center' }}>
        {children}
      </div>
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        {caption}
      </span>
    </PrimitiveFrame>
  );
}

/**
 * Static preview of the GridOverlay. The real component renders as a fixed
 * full-viewport overlay (toggled by ?grid=1), which is hard to demonstrate
 * in a styleguide tile. This preview shows the same column count + spacing
 * in a contained box so the visual treatment is on-page even when the
 * overlay isn't active.
 */
function GridOverlayPreview() {
  return (
    <div
      style={{
        position: 'relative',
        height: 'var(--space-10)',
        border: 'var(--stroke-hairline) solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--space-5)',
          paddingInline: 'var(--space-6)',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              borderLeft:
                'var(--stroke-thin) solid color-mix(in oklab, var(--color-accent) 38%, transparent)',
              borderRight:
                'var(--stroke-thin) solid color-mix(in oklab, var(--color-accent) 38%, transparent)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
