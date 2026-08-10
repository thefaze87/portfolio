/**
 * Email design tokens.
 *
 * ## Why this file exists instead of importing styles/tokens.css
 *
 * The site's palette lives in CSS custom properties. **Email clients cannot
 * use them** — Outlook's Word rendering engine and several Gmail contexts
 * drop `var()` entirely, leaving unstyled text. Every value here is therefore
 * a literal, and this file is the single place they are declared so a future
 * transactional email can't invent its own greys.
 *
 * The values mirror the site with one deliberate divergence: `textSecondary`
 * is #B8B8B8 rather than the site's #ACA79E. Email bodies are read in more
 * hostile lighting than a website and often at smaller effective sizes, so
 * secondary text is lifted slightly for contrast.
 *
 * ## Typography
 *
 * Cabinet Grotesk, Inter, and JetBrains Mono are self-hosted woff2. Webfonts
 * are unreliable in email — Outlook ignores @font-face, Gmail strips it, and
 * a blocked font means a silent fallback to Times New Roman. The stacks below
 * name the brand faces first (they render for the minority of clients that
 * support them, notably Apple Mail) and degrade to system faces that carry the
 * same tone. This is the one place the brand's font rule is knowingly relaxed,
 * because the alternative is worse-looking mail.
 */

export const color = {
  background: '#0A0A0A',
  surface: '#121212',
  textPrimary: '#F5F2EB',
  textSecondary: '#B8B8B8',
  accent: '#FF6B35',
  border: 'rgba(255,255,255,0.10)',
  /** Solid equivalent of `border` for clients that drop rgba (Outlook). */
  borderSolid: '#2A2A2A',
} as const;

export const font = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  display:
    "'Cabinet Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

/** 4px base, matching the site's spacing scale. */
export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
} as const;

/** Email column width. 600px is the widest that reliably avoids horizontal
 *  scroll in Outlook's reading pane and on small phones. */
export const CONTENT_WIDTH = 600;

/* ============================================================================
 * Shared style objects
 *
 * Inline styles rather than classes: <style> blocks in <head> are stripped by
 * Gmail's web client for forwarded mail and by several corporate gateways.
 * Inline is the only styling that survives everywhere.
 * ========================================================================== */

export const text = {
  body: {
    fontFamily: font.sans,
    fontSize: '15px',
    lineHeight: '1.65',
    color: color.textSecondary,
    margin: `0 0 ${space[4]} 0`,
  },
  bodyStrong: {
    fontFamily: font.sans,
    fontSize: '15px',
    lineHeight: '1.65',
    color: color.textPrimary,
    margin: `0 0 ${space[4]} 0`,
  },
  small: {
    fontFamily: font.sans,
    fontSize: '13px',
    lineHeight: '1.6',
    color: color.textSecondary,
    margin: '0',
  },
  monoLabel: {
    fontFamily: font.mono,
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: color.textSecondary,
    margin: '0',
  },
} as const;

export const link = {
  color: color.accent,
  textDecoration: 'underline',
  fontFamily: font.sans,
} as const;
