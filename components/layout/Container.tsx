import { cn } from '@/lib/utils';

/**
 * Container — the horizontal measure of the site. Caps content at the
 * container width and applies the responsive gutter (24 → 40 → 64 → 80px,
 * driven by --container-gutter's media queries in tokens.css).
 *
 * Every full-width band on the site resolves its inner width through this
 * component. Changing site measure means changing one file.
 *
 * `wide` opts into --container-wide (1440px) for layouts that genuinely need
 * the extra room (full-bleed diagrams, gallery grids). Default is 1280px.
 *
 * Server Component.
 */
interface ContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export function Container({ children, wide = false, className }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto', className)}
      style={{
        maxWidth: wide ? 'var(--container-wide)' : 'var(--container-default)',
        paddingInline: 'var(--container-gutter)',
      }}
    >
      {children}
    </div>
  );
}
