/**
 * GridOverlay — fixed-position 12-column orthographic grid.
 *
 * Visualizes the underlying layout grid for design verification. Two modes:
 *   - `accent` (styleguide) — strong orange hairlines, used when the URL
 *     carries `?grid=1`.
 *   - default (production) — 0.5px low-opacity lines that sit behind content
 *     as part of the brand's visual language (per docs/brand-spec.md §6).
 *
 * Always renders as a Server Component. Pointer-events disabled; never
 * interferes with focus, scroll, or hit-testing.
 */

type GridOverlayProps = {
  accent?: boolean;
};

export function GridOverlay({ accent = false }: GridOverlayProps) {
  const lineColor = accent
    ? 'color-mix(in oklab, var(--color-accent) 38%, transparent)'
    : 'color-mix(in oklab, var(--color-text) 8%, transparent)';
  const lineWidth = accent ? '1px' : '0.5px';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
      data-testid="grid-overlay"
    >
      <div
        className="mx-auto grid h-full max-w-[var(--container-default)] grid-cols-12 gap-[var(--space-5)]"
        style={{ paddingInline: 'var(--container-gutter)' }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              borderLeft: `${lineWidth} solid ${lineColor}`,
              borderRight: `${lineWidth} solid ${lineColor}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
