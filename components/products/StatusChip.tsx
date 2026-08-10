import type { ProductStatus } from '@/lib/content-schemas';

/**
 * StatusChip — product lifecycle state.
 *
 * Deliberately editorial rather than a SaaS-dashboard pill: hairline border,
 * mono label, sharp radius, no fill. The brand rule is that orange is a signal
 * colour, so only `Launching` gets the accent — it is the one state that is
 * news. `In development` and `Planned` sit at muted and dim respectively, so a
 * products index reads as a hierarchy of readiness at a glance without turning
 * into a traffic light.
 *
 * The dot is a 4px square, not a circle: circles read as status LEDs, which is
 * the product-dashboard vocabulary this is avoiding.
 *
 * Server Component.
 */

const TONE: Record<ProductStatus, { color: string; border: string }> = {
  Launching: { color: 'var(--color-accent)', border: 'var(--color-accent)' },
  'In development': { color: 'var(--color-text-muted)', border: 'var(--color-border-strong)' },
  Planned: { color: 'var(--color-text-dim)', border: 'var(--color-border)' },
};

export function StatusChip({ status }: { status: ProductStatus }) {
  const tone = TONE[status];

  return (
    <span
      className="type-mono-label inline-flex items-center"
      style={{
        gap: 'var(--space-2)',
        color: tone.color,
        paddingBlock: 'var(--space-1)',
        paddingInline: 'var(--space-3)',
        border: `var(--stroke-hairline) solid ${tone.border}`,
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 4, height: 4, background: 'currentColor', flexShrink: 0 }}
      />
      {status}
    </span>
  );
}
