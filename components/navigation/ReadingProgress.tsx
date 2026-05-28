'use client';

import { useEffect, useState } from 'react';

/**
 * ReadingProgress — left-gutter scroll indicator for long content pages.
 *
 * Opt-in: a page mounts it with its section list. Shown only on large
 * desktops (≥1440px) where the gutter has room; below that it renders
 * nothing. Tracks overall scroll progress and the currently-visible
 * section, displayed as a mono percentage + section label beside a thin
 * vertical track.
 *
 * Client Component (scroll listener). Marked aria-hidden — it's a visual
 * reading aid; the page's heading structure is the real semantic outline,
 * so screen readers needn't hear a duplicate.
 */

export type ReadingSection = { id: string; label: string };

interface ReadingProgressProps {
  sections: readonly ReadingSection[];
}

export function ReadingProgress({ sections }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);

      const threshold = window.innerHeight * 0.3;
      let current = sections[0]?.id ?? '';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = section.id;
        }
      }
      setActiveId(current);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sections]);

  const activeLabel = sections.find((s) => s.id === activeId)?.label ?? '';
  const pct = Math.round(progress * 100);

  return (
    <aside
      aria-hidden="true"
      className="fixed top-1/2 left-0 hidden -translate-y-1/2 min-[1440px]:flex"
      style={{
        flexDirection: 'column',
        gap: 'var(--space-3)',
        paddingInline: 'var(--space-6)',
      }}
    >
      <span className="type-mono-label nums-tabular" style={{ color: 'var(--color-accent)' }}>
        {pct.toString().padStart(2, '0')}%
      </span>
      <div
        style={{
          position: 'relative',
          width: 'var(--stroke-thick)',
          height: 'var(--space-10)',
          background: 'var(--color-border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            top: 0,
            height: `${pct}%`,
            background: 'var(--color-accent)',
          }}
        />
      </div>
      <span
        className="type-mono-label"
        style={{
          color: 'var(--color-text-muted)',
          writingMode: 'vertical-rl',
          maxHeight: 'var(--space-11)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {activeLabel}
      </span>
    </aside>
  );
}
