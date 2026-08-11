import type { ProductStatus } from '@/lib/content-schemas';

/**
 * StatusChip — product lifecycle state.
 *
 * Deliberately editorial rather than a SaaS-dashboard pill: hairline border,
 * mono label, sharp radius, no fill. The brand rule is that orange is a signal
 * colour, so only `Launching` gets the accent — it is the one state that is
 * news. The rest step down through the text ramp, so a products index reads as
 * a hierarchy of readiness at a glance without turning into a traffic light:
 *
 *   Launching        accent      shipping now
 *   Coming Soon      text        announced next, full-strength but not orange
 *   In development   text-muted  being built
 *   Planned          text-dim    a concept
 *
 * `Coming Soon` deliberately does NOT get the amber accent-secondary token.
 * A second hue on this index is exactly the traffic light the chip avoids, and
 * amber reads as a warning everywhere else in the system. Full-strength text on
 * a strong border makes it the brightest non-accent state, which is the whole
 * job — noticeable, not news.
 *
 * The dot is a 4px square, not a circle: circles read as status LEDs, which is
 * the product-dashboard vocabulary this is avoiding.
 *
 * Server Component.
 */

const TONE: Record<ProductStatus, { color: string; border: string }> = {
  Launching: { color: 'var(--color-accent)', border: 'var(--color-accent)' },
  'Coming Soon': { color: 'var(--color-text)', border: 'var(--color-border-strong)' },
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
