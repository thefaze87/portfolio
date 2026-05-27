/**
 * WCAG 2.2 relative-luminance contrast utilities.
 *
 * Used by the styleguide to verify every color combination in the palette
 * passes the contrast budget declared in docs/brand-spec.md (AA minimum for
 * body text, AAA where the design allows). Pure functions; no DOM access.
 */

type Rgb = readonly [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '').toLowerCase();
  if (h.length !== 6) {
    throw new Error(`hexToRgb: expected 6-char hex, got "${hex}"`);
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function srgbToLinear(channel: number): number {
  const v = channel / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagGrade = 'AAA' | 'AA' | 'AA Large' | 'fail';

/**
 * Returns the strongest WCAG grade a contrast ratio satisfies.
 * - AAA       ≥ 7:1   (normal text, strictest)
 * - AA        ≥ 4.5:1 (normal text, required)
 * - AA Large  ≥ 3:1   (large/bold text only; insufficient for body)
 * - fail      < 3:1
 */
export function wcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'fail';
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
