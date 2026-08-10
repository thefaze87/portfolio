/**
 * Callout — an aside inside long-form content.
 *
 * Three tones, each mapped to a semantic token rather than an arbitrary color:
 *   note    — muted border, no signal. The default.
 *   insight — accent border. The critical takeaway. Use sparingly; this is the
 *             orange budget for the article.
 *   warning — the amber status token. A genuine caveat, not emphasis.
 *
 * Available in MDX without an import (registered in MDXComponents).
 *
 * Server Component.
 */

type CalloutTone = 'note' | 'insight' | 'warning';

const TONE: Record<CalloutTone, { border: string; label: string; labelColor: string }> = {
  note: {
    border: 'var(--color-border-strong)',
    label: 'Note',
    labelColor: 'var(--color-text-muted)',
  },
  insight: { border: 'var(--color-accent)', label: 'Insight', labelColor: 'var(--color-accent)' },
  warning: { border: 'var(--color-warning)', label: 'Caveat', labelColor: 'var(--color-warning)' },
};

interface CalloutProps {
  children: React.ReactNode;
  type?: CalloutTone;
  /** Overrides the default label for the tone. */
  label?: string;
}

export function Callout({ children, type = 'note', label }: CalloutProps) {
  const tone = TONE[type];

  return (
    <aside
      style={{
        marginBlock: 'var(--space-7)',
        padding: 'var(--space-6)',
        borderLeft: `var(--stroke-thick) solid ${tone.border}`,
        background: 'var(--color-surface)',
        borderRadius: `0 var(--radius-xs) var(--radius-xs) 0`,
        maxWidth: '68ch',
      }}
    >
      <span className="type-mono-label" style={{ color: tone.labelColor }}>
        {label ?? tone.label}
      </span>
      <div className="callout-body" style={{ marginTop: 'var(--space-3)' }}>
        {children}
      </div>
    </aside>
  );
}
