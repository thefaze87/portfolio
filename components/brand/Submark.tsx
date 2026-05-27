import { cn } from '@/lib/utils';

/**
 * Submark — small monoline system glyphs that sit beside page titles,
 * reinforcing "this person draws systems." 1.5px stroke, 24×24 viewBox,
 * default render size 16. Stroke inherits `currentColor` so the glyph
 * picks up the surrounding text color; accent strokes use --color-accent
 * directly so the brand cue can't be styled away by accident.
 *
 * Per docs/brand-spec.md §3 the four canonical names:
 *   topology — three connected nodes in a triangle (Experience pages)
 *   layers   — three horizontal lines, middle one orange (Architecture)
 *   cube     — isometric cube (Products)
 *   compass  — N/E/S/W with the north arm orange (About)
 *
 * Architecturally: `name` is a literal union, not a free string. The
 * four glyphs are the system; rendering an unknown name is a compile
 * error, not a silent miss.
 */

export type SubmarkName = 'topology' | 'layers' | 'cube' | 'compass';

interface SubmarkProps {
  name: SubmarkName;
  /** Render size in px. Default 16 (the brand-canonical inline size). */
  size?: number;
  className?: string;
  /** If set, the glyph is announced to assistive tech with this label.
   *  When omitted, it's marked aria-hidden (decorative). */
  'aria-label'?: string;
}

export function Submark({ name, size = 16, className, 'aria-label': ariaLabel }: SubmarkProps) {
  const decorative = !ariaLabel;
  const commonSvgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: cn(className),
    ...(decorative
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': ariaLabel }),
  };

  switch (name) {
    case 'topology':
      return (
        <svg {...commonSvgProps} xmlns="http://www.w3.org/2000/svg">
          {!decorative && <title>{ariaLabel}</title>}
          <line x1="12" y1="6" x2="5.5" y2="18" />
          <line x1="12" y1="6" x2="18.5" y2="18" />
          <line x1="5.5" y1="18" x2="18.5" y2="18" />
          <circle cx="12" cy="6" r="2" fill="var(--color-bg)" />
          <circle cx="5.5" cy="18" r="2" fill="var(--color-bg)" />
          <circle cx="18.5" cy="18" r="2" fill="var(--color-bg)" />
        </svg>
      );

    case 'layers':
      return (
        <svg {...commonSvgProps} xmlns="http://www.w3.org/2000/svg">
          {!decorative && <title>{ariaLabel}</title>}
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="var(--color-accent)" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      );

    case 'cube':
      return (
        <svg {...commonSvgProps} xmlns="http://www.w3.org/2000/svg">
          {!decorative && <title>{ariaLabel}</title>}
          {/* top diamond */}
          <line x1="12" y1="4" x2="20" y2="8" />
          <line x1="20" y1="8" x2="12" y2="12" />
          <line x1="12" y1="12" x2="4" y2="8" />
          <line x1="4" y1="8" x2="12" y2="4" />
          {/* left & right walls */}
          <line x1="4" y1="8" x2="4" y2="16" />
          <line x1="20" y1="8" x2="20" y2="16" />
          {/* bottom edges */}
          <line x1="4" y1="16" x2="12" y2="20" />
          <line x1="12" y1="20" x2="20" y2="16" />
          {/* front vertical */}
          <line x1="12" y1="12" x2="12" y2="20" />
        </svg>
      );

    case 'compass':
      return (
        <svg {...commonSvgProps} xmlns="http://www.w3.org/2000/svg">
          {!decorative && <title>{ariaLabel}</title>}
          {/* north arm — orange */}
          <line x1="12" y1="4" x2="12" y2="11" stroke="var(--color-accent)" />
          {/* south, east, west */}
          <line x1="12" y1="13" x2="12" y2="20" />
          <line x1="4" y1="12" x2="11" y2="12" />
          <line x1="13" y1="12" x2="20" y2="12" />
          {/* center pivot */}
          <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
