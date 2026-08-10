import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * Placeholder — the reserved slot for content that does not exist yet.
 *
 * Gallery and links are required sections of the product template but neither
 * has content today. The options were: omit the section, ship a broken image
 * icon, or reserve the space honestly. Only the third is defensible on a site
 * that reads as a publication.
 *
 * The treatment is a hairline-ruled frame carrying a drafting grid at ~4%
 * opacity — the same orthographic grid used in the hero masthead, so an empty
 * slot reads as part of the visual system rather than as a missing asset. No
 * icon, no dashed border, no "coming soon" badge; a mono caption states plainly
 * what will live here.
 *
 * `aspect` shapes the frame: 'wide' for gallery figures, 'flat' for a link row.
 *
 * Server Component.
 */

interface PlaceholderProps {
  label: string;
  caption: string;
  aspect?: 'wide' | 'flat';
}

export function Placeholder({ label, caption, aspect = 'wide' }: PlaceholderProps) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{
          marginTop: 'var(--space-5)',
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: aspect === 'wide' ? '16 / 9' : undefined,
          minHeight: aspect === 'flat' ? 'var(--space-10)' : undefined,
          border: 'var(--stroke-hairline) solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
        }}
      >
        {/* Drafting grid — the same orthographic underlay as the hero
         * masthead, so a reserved slot belongs to the design system rather
         * than looking like a failed image request. */}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <pattern id={`ph-${label}`} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 H 0 V 32" fill="none" stroke="var(--color-text)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#ph-${label})`} opacity={0.04} />
        </svg>

        <p
          className="type-mono-label"
          style={{
            position: 'relative',
            margin: 0,
            color: 'var(--color-text-dim)',
            textAlign: 'center',
            maxWidth: '40ch',
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
