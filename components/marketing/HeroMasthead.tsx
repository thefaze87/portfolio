import { useId } from 'react';

/**
 * HeroMasthead — the ambient architectural backdrop behind the hero content.
 *
 * A technical drafting board seen through frosted glass. Four layers, all
 * decorative (the whole thing is aria-hidden) and all at very low opacity so
 * foreground text contrast is untouched:
 *
 *   1. Drafting grid — an SVG line pattern at ~5% (not a gradient).
 *   2. Ghost wordmark — a giant outline "SYSTEMS" in Fraunces at ~3%,
 *      cropped by the hero's edges. Discovered, not obvious.
 *   3. Blueprint overlay — abstract boundary boxes, nodes, and connection
 *      paths (NOT a literal software diagram) plus figure annotations.
 *   4. Motion — the connection paths draw once on load; one node pulses
 *      faintly. CSS only, gated behind prefers-reduced-motion (globals.css).
 *
 * Server Component. Rendered inside a position:relative, overflow:hidden hero
 * section; sits behind content via the content's own z-index.
 */
export function HeroMasthead() {
  const uid = useId();
  const gridId = `${uid}-grid`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        color: 'var(--color-text)',
      }}
    >
      {/* Layer 1 — drafting grid */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <pattern id={gridId} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 H 0 V 44" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} opacity={0.05} />
      </svg>

      {/* Layer 2 — ghost wordmark, cropped by the viewport edges */}
      <span
        style={{
          position: 'absolute',
          left: '-1.5%',
          bottom: '-14%',
          fontFamily: 'var(--font-serif)',
          fontWeight: 600,
          fontSize: 'clamp(16rem, 36vw, 34rem)',
          lineHeight: 0.8,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px var(--color-text)',
          opacity: 0.03,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        SYSTEMS
      </span>

      {/* Layer 3 — blueprint overlay (abstract; not a real diagram) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g opacity={0.09} stroke="currentColor" fill="none" strokeWidth={1}>
          {/* Boundary boxes */}
          <rect x={992} y={64} width={372} height={232} rx={2} />
          <rect x={72} y={372} width={300} height={168} rx={2} />

          {/* Connection paths — drawn once on load (see globals.css) */}
          <polyline
            data-masthead-path=""
            style={{ ['--masthead-delay' as string]: '200ms' }}
            points="1020,96 1178,212 1336,96"
            pathLength={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            data-masthead-path=""
            style={{ ['--masthead-delay' as string]: '520ms' }}
            points="1178,212 1178,268 1020,268"
            pathLength={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            data-masthead-path=""
            style={{ ['--masthead-delay' as string]: '840ms' }}
            points="104,404 104,508 332,508"
            pathLength={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes */}
          <circle cx={1020} cy={96} r={5} fill="var(--color-bg)" />
          <circle cx={1336} cy={96} r={5} fill="var(--color-bg)" />
          <circle cx={1020} cy={268} r={5} fill="var(--color-bg)" />
          <circle cx={104} cy={404} r={5} fill="var(--color-bg)" />
          {/* One faintly-pulsing node */}
          <circle
            data-masthead-pulse=""
            cx={1178}
            cy={212}
            r={6}
            fill="currentColor"
            stroke="none"
          />
        </g>
      </svg>

      {/* Figure annotations — crisp HTML, kept out of the foreground text zones */}
      {[
        { label: 'ARCH.01', style: { top: 'var(--space-7)', right: 'var(--space-7)' } },
        { label: 'NODE.12', style: { bottom: 'var(--space-8)', left: 'var(--space-7)' } },
        { label: 'SYS.04', style: { bottom: 'var(--space-7)', right: 'var(--space-7)' } },
      ].map((a) => (
        <span
          key={a.label}
          className="type-mono-label"
          style={{
            position: 'absolute',
            color: 'var(--color-text-muted)',
            opacity: 0.45,
            ...a.style,
          }}
        >
          {a.label}
        </span>
      ))}
    </div>
  );
}
