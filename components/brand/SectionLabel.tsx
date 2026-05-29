import { cn } from '@/lib/utils';

/**
 * SectionLabel — the technical reference tag used to mark sections
 * (ARCH.01, CASE.02, THINK.01, …). A short leading tick + mono uppercase
 * label, echoing the drafting-board annotations in the hero masthead.
 *
 * Distinct from <EyebrowLabel> (which leads with a 24px orange divider and
 * announces a role/topic). SectionLabel is terser and muted by default —
 * a figure callout, not a headline kicker. Pass the literal label as
 * children, e.g. <SectionLabel>ARCH.01</SectionLabel>.
 *
 * Server-safe. Muted by default; `accent` switches it (and its tick) to
 * orange for the rare case a section start should carry the signal color.
 */
interface SectionLabelProps {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function SectionLabel({ children, accent = false, className }: SectionLabelProps) {
  const color = accent ? 'var(--color-accent)' : 'var(--color-text-muted)';
  return (
    <span
      className={cn('type-mono-label inline-flex items-center', className)}
      style={{ color, gap: 'var(--space-2)' }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 'var(--space-3)',
          height: 'var(--stroke-thin)',
          background: color,
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}
