import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * TopologyHero — the homepage hero diagram.
 *
 * A four-layer system topology (Interface · Intelligence · Services ·
 * Foundation), twelve nodes, over a faint hairline mesh. A single orange
 * critical path descends diagonally through every layer — the one thing the
 * eye is meant to follow. "Software architecture as editorial line-art."
 *
 * Server Component, inline SVG (no image request, no CLS). Entrance motion is
 * pure CSS, defined in globals.css under prefers-reduced-motion: no-preference
 * — reduced-motion users see the final state with no animation. Color is
 * token-driven: structural geometry inherits `currentColor` (so it flips with
 * the theme) and the critical path uses --color-accent.
 *
 * Per docs/brand-spec.md the diagram has a descriptive title + desc for AT;
 * the geometry itself is hidden from the a11y tree via role="img".
 */

const VIEW_W = 560;
const VIEW_H = 460;

const LAYERS = [
  { label: 'Interface', y: 70 },
  { label: 'Intelligence', y: 180 },
  { label: 'Services', y: 290 },
  { label: 'Foundation', y: 400 },
] as const;

const COLS = [240, 370, 500] as const;

/** Column index of the critical-path node in each layer — a diagonal descent. */
const CRIT_COL = [0, 1, 2, 2] as const;

const NODE_STAGGER_MS = 40;
const PATH_START_MS = 680;
const PATH_STAGGER_MS = 110;

function delay(ms: number): React.CSSProperties {
  return { ['--hero-delay' as string]: `${ms}ms` };
}

export function TopologyHero({ className }: { className?: string }) {
  const critNodes = LAYERS.map((layer, i) => ({ x: COLS[CRIT_COL[i]!]!, y: layer.y }));

  // Unique ids per instance — the diagram can render more than once on a page
  // (e.g. the styleguide's dark + light specimens), and duplicate ids break
  // aria-labelledby and the marker reference.
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const arrowId = `${uid}-arrow`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={VIEW_W}
      height={VIEW_H}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      style={{ width: '100%', height: 'auto', maxWidth: VIEW_W, color: 'var(--color-text)' }}
    >
      <title id={titleId}>System topology</title>
      <desc id={descId}>
        A four-layer architecture — Interface, Intelligence, Services, and Foundation — of twelve
        nodes. An orange critical path traces the flow diagonally from the interface layer down
        through to the foundation.
      </desc>

      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* Layer baselines — faintest structural rule per layer. */}
      {LAYERS.map((layer) => (
        <line
          key={`base-${layer.label}`}
          x1={200}
          y1={layer.y}
          x2={520}
          y2={layer.y}
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.08}
        />
      ))}

      {/* Vertical structural connectors — faint mesh the critical path cuts across. */}
      {COLS.map((x) =>
        LAYERS.slice(0, -1).map((layer, i) => (
          <line
            key={`conn-${x}-${i}`}
            x1={x}
            y1={layer.y}
            x2={x}
            y2={LAYERS[i + 1]!.y}
            stroke="currentColor"
            strokeWidth={0.5}
            opacity={0.16}
          />
        )),
      )}

      {/* Structural nodes — every non-critical node. Hairline rings on the bg. */}
      {LAYERS.map((layer, li) =>
        COLS.map((x, ci) =>
          ci === CRIT_COL[li] ? null : (
            <circle
              key={`node-${li}-${ci}`}
              data-hero-node=""
              style={delay((li * COLS.length + ci) * NODE_STAGGER_MS)}
              cx={x}
              cy={layer.y}
              r={7}
              fill="var(--color-bg)"
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.5}
            />
          ),
        ),
      )}

      {/* Critical path — orange directional lines, drawn after the nodes settle. */}
      {critNodes.slice(0, -1).map((node, i) => {
        const next = critNodes[i + 1]!;
        return (
          <line
            key={`crit-line-${i}`}
            data-hero-path=""
            style={delay(PATH_START_MS + i * PATH_STAGGER_MS)}
            x1={node.x}
            y1={node.y}
            x2={next.x}
            y2={next.y}
            pathLength={1}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            markerEnd={`url(#${arrowId})`}
          />
        );
      })}

      {/* Critical nodes — orange, on the path. */}
      {critNodes.map((node, i) => (
        <circle
          key={`crit-node-${i}`}
          data-hero-node=""
          style={delay((i * COLS.length + CRIT_COL[i]!) * NODE_STAGGER_MS)}
          cx={node.x}
          cy={node.y}
          r={8.5}
          fill="var(--color-accent)"
        />
      ))}

      {/* Layer labels — mono, muted, left of the nodes. */}
      {LAYERS.map((layer) => (
        <text
          key={`label-${layer.label}`}
          x={20}
          y={layer.y + 4}
          fill="currentColor"
          opacity={0.55}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {layer.label}
        </text>
      ))}

      {/* Editorial annotations. */}
      <text
        x={540}
        y={28}
        textAnchor="end"
        fill="currentColor"
        opacity={0.55}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em' }}
      >
        FIG. 01
      </text>
      <text
        x={540}
        y={448}
        textAnchor="end"
        fill="currentColor"
        opacity={0.4}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em' }}
      >
        4L · 12N
      </text>
    </svg>
  );
}
