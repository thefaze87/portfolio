import { ImageResponse } from 'next/og';

/**
 * Default Open Graph card, generated at build time via next/og (built into
 * Next 16 — no @vercel/og dependency needed).
 *
 * As a root-level `opengraph-image`, this becomes the fallback social card for
 * every route that doesn't define its own. Previously the site declared
 * `openGraph` metadata with no image at all, so every LinkedIn and Slack share
 * rendered a blank rectangle.
 *
 * Typography note: Satori (the renderer behind ImageResponse) cannot read
 * woff2, which is the only format the brand fonts ship in here. Rather than
 * add duplicate .ttf assets to the repo for one image, the card leans on
 * composition — the drafting grid, the orange rule, scale, and spacing — using
 * the bundled default face. Swapping in Cabinet Grotesk later means adding one
 * .ttf and a `fonts` option; the layout does not change.
 */

export const alt = 'Mark Fasel — Solutions Architect & AI Strategist';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#0A0A0A';
const TEXT = '#F5F2EB';
const MUTED = '#ACA79E';
const ACCENT = '#FF6B35';
const BORDER = '#2A2A2A';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        padding: 80,
        // Hairline drafting grid — the brand's orthographic underlay.
        backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}
    >
      {/* Top rule + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 64, height: 2, background: ACCENT }} />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: ACCENT,
            textTransform: 'uppercase',
          }}
        >
          Mark Fasel
        </div>
      </div>

      {/* Statement */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 92,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: TEXT,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Better systems.</span>
          <span>Better decisions.</span>
          {/* Satori makes each text node a flex item and collapses the
           * whitespace between them, so the space before "scale." has to be
           * a real gap rather than a character. */}
          <div style={{ display: 'flex', gap: 24 }}>
            <span>Built to</span>
            <span style={{ color: ACCENT }}>scale.</span>
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 28,
        }}
      >
        {/* The two-role lockup, not the full four-role site line — at this
         * size the long version wrapped onto a second line and collided
         * with the URL. Matches the footer lockup in the brand spec. */}
        <div style={{ fontSize: 24, letterSpacing: 3, color: MUTED, whiteSpace: 'nowrap' }}>
          SOLUTIONS ARCHITECT · AI STRATEGIST
        </div>
        <div style={{ fontSize: 24, letterSpacing: 3, color: MUTED, whiteSpace: 'nowrap' }}>
          MARKFASEL.COM
        </div>
      </div>
    </div>,
    size,
  );
}
