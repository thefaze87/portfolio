import { cn } from '@/lib/utils';

/**
 * GridOverlay — fixed-position 12-column orthographic grid.
 *
 * Visualizes the underlying layout grid. The grid is part of the brand's
 * visual language (per docs/brand-spec.md §2 "hairline orthographic grids
 * underneath content, 1px ~8% opacity, on a 12-column subgrid") — it's
 * not just a dev tool. The overlay is enabled in two ways:
 *
 *   1. **Toggle**: any page can opt-in via `?grid=1` in the URL and render
 *      this in `accent` mode. The styleguide wires this directly into its
 *      header nav.
 *   2. **Ambient** (future Phase 3+): pages that want the grid as a
 *      background visual layer render the default (non-accent) mode.
 *      Hairlines sit at 8% text opacity, never demanding attention.
 *
 * Architecturally:
 *   - 12 columns is a brand-system invariant. Not configurable — exposing
 *     `columns` as a prop would let consumers fork the grid. Locked.
 *   - Container width + gutters mirror the page container exactly, so
 *     the overlay's lines sit on the same logical grid as content.
 *   - `aria-hidden` and `pointer-events: none` are non-negotiable: the
 *     overlay is decoration only, must never affect focus or input.
 *
 * Server Component.
 */

export const GRID_COLUMNS = 12;

type GridOverlayProps = {
  /** Strong orange variant for explicit toggle (`?grid=1`). Default is
   *  the ambient ~8% text-opacity treatment for background use. */
  accent?: boolean;
  className?: string;
};

export function GridOverlay({ accent = false, className }: GridOverlayProps) {
  const lineColor = accent
    ? 'color-mix(in oklab, var(--color-accent) 38%, transparent)'
    : 'color-mix(in oklab, var(--color-text) 8%, transparent)';
  const lineWidth = accent ? 'var(--stroke-thin)' : 'var(--stroke-hairline)';

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-50', className)}
      data-testid="grid-overlay"
    >
      <div
        className="mx-auto grid h-full max-w-[var(--container-default)] grid-cols-12 gap-[var(--space-5)]"
        style={{ paddingInline: 'var(--container-gutter)' }}
      >
        {Array.from({ length: GRID_COLUMNS }, (_, i) => (
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
