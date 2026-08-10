import Image from 'next/image';

/**
 * ExperiencePortrait — portrait + blueprint composite for the /experience
 * hero. The composition reads:
 *
 *   1. Headline (left column, owned by ExperienceHero)
 *   2. Mark Fasel — the cutout silhouette
 *   3. Architectural blueprint details (grid, lines, circle, ghost type,
 *      orange annotations) layered behind and around the figure
 *
 * Depth (per spec):
 *   z-index 1 — blueprint backdrop (grid, construction geometry, circle,
 *                technical linework). Fills the full grid column so the
 *                portrait sits *inside* the system, not next to it.
 *   z-index 2 — orange mono annotations placed at the four corners of
 *                the column (upper-left, upper-right, mid-left, lower-right).
 *                Behind the portrait by z-index, but the cutout PNG's alpha
 *                means mid-left and lower-right show through Mark's negative
 *                space, not over his body.
 *   z-index 3 — the portrait itself (an RGBA cutout, no rectangular frame).
 *
 * Photo treatment: no filter, no mask, no transform. Next/Image renders
 * the natively-1537×1023 RGBA source at full quality; CSS sets
 * `object-fit: contain` + `object-position: bottom center` so the figure
 * stands grounded inside the wrapper, letterboxed at the top by transparent
 * pixels (the blueprint shows through). Because the source itself has
 * alpha, *no* CSS mask is needed — the silhouette is the visible shape.
 *
 * Mobile: blueprint reduced ~80% (only the circle and ARCH.01 remain);
 * portrait centered at max-width 360, stacked beneath the copy.
 *
 * Server Component.
 */
export function ExperiencePortrait() {
  return (
    <div className="exp-portrait">
      <svg
        className="exp-portrait-blueprint"
        viewBox="0 0 1000 1300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="exp-portrait-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 L 0 40"
              fill="none"
              stroke="rgba(255,255,255,.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Layer 1 — drafting grid */}
        <g className="exp-blueprint-desktop" opacity="0.05">
          <rect width="1000" height="1300" fill="url(#exp-portrait-grid)" />
        </g>

        {/* Layer 1 cont. — construction geometry (centerlines + diagonals) */}
        <g
          className="exp-blueprint-desktop"
          opacity="0.05"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="0.75"
          fill="none"
        >
          <line x1="500" y1="0" x2="500" y2="1300" />
          <line x1="0" y1="650" x2="1000" y2="650" />
          <line x1="0" y1="0" x2="1000" y2="1300" />
          <line x1="1000" y1="0" x2="0" y2="1300" />
        </g>

        {/* Layer 1 cont. — large circular architectural diagram. Slightly
         * stronger (0.05) so it still reads on mobile where it's the only
         * blueprint element kept. */}
        <g opacity="0.05" stroke="rgba(255,255,255,.08)" strokeWidth="1.25" fill="none">
          <circle cx="500" cy="650" r="380" />
        </g>

        {/* Layer 1 cont. — technical linework (node markers + dimension ticks) */}
        <g
          className="exp-blueprint-desktop"
          opacity="0.05"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="0.5"
          fill="none"
        >
          <circle cx="160" cy="200" r="20" />
          <line x1="100" y1="200" x2="220" y2="200" />
          <line x1="160" y1="140" x2="160" y2="260" />
          <circle cx="840" cy="1100" r="16" />
          <line x1="780" y1="1100" x2="900" y2="1100" />
          <line x1="840" y1="1040" x2="840" y2="1160" />
        </g>
      </svg>

      {/* Subtle radial vignette behind the portrait — extremely feathered
       * dark gray, hidden on mobile per "reduce blueprint by 80%". Provides
       * separation between the cutout and the lighter blueprint elements
       * without reading as a halo. */}
      <div aria-hidden="true" className="exp-portrait-vignette exp-blueprint-desktop" />

      {/* Layer 3 — orange technical annotations. Four corners per spec.
       * ARCH.01 also renders on mobile (per "reduce blueprint by 80%"
       * keeping ARCH.01 + the circle); the other three are desktop-only. */}
      <span aria-hidden="true" className="exp-portrait-anno exp-portrait-anno--arch">
        ARCH.01
      </span>
      <span
        aria-hidden="true"
        className="exp-portrait-anno exp-portrait-anno--system exp-blueprint-desktop"
      >
        SYSTEM DESIGN
      </span>
      <span
        aria-hidden="true"
        className="exp-portrait-anno exp-portrait-anno--architecture exp-blueprint-desktop"
      >
        ARCHITECTURE
      </span>
      <span
        aria-hidden="true"
        className="exp-portrait-anno exp-portrait-anno--api exp-blueprint-desktop"
      >
        API DESIGN
      </span>

      <div className="exp-portrait-photo">
        {/* This was previously `unoptimized` on the belief that Next/Sharp
         * strips the cutout's alpha channel. That was wrong, and verified so:
         * sharp 0.34 encoding this exact source preserves alpha in both
         * formats — AVIF 42KB and WebP 35KB against a 793KB PNG, both
         * hasAlpha=true. The original failure was almost certainly lossy
         * WebP (VP8), which does drop alpha; `formats: ['image/avif', …]` in
         * next.config.ts already prevents that path.
         *
         * `sizes` matters here: without it Next serves the widest candidate
         * to every device. The portrait is capped at 360px on mobile and
         * 800px on desktop by .exp-portrait-photo. */}
        <Image
          src="/images/mark-fasel-portrait.png"
          alt="Mark Fasel"
          width={978}
          height={1023}
          priority
          sizes="(max-width: 1023px) 360px, 800px"
          className="exp-portrait-img"
        />
      </div>
    </div>
  );
}
