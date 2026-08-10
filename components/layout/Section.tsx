import { cn } from '@/lib/utils';
import { Container } from '@/components/layout/Container';

/**
 * Section — the vertical rhythm unit. A full-width band containing a
 * Container, with the section's vertical padding and its leading hairline
 * divider.
 *
 * This is the shell that was previously hand-repeated in every section
 * component (container + gutter + --section-py + borderTop). Consolidating it
 * means section rhythm and the divider treatment are each defined once.
 *
 * Props:
 *   - `divider` (default true) — the 0.5px top rule that separates bands.
 *     Pass false on the first section of a page; it would draw a line
 *     immediately under the header.
 *   - `id` — anchor target, also consumed by ReadingProgress.
 *   - `labelledBy` — id of the heading that names this section. Supply it
 *     when the section should be an addressable landmark; omit for purely
 *     visual bands so the landmark set stays clean.
 *
 * Server Component.
 */
interface SectionProps {
  children: React.ReactNode;
  id?: string;
  divider?: boolean;
  labelledBy?: string;
  wide?: boolean;
  className?: string;
}

export function Section({
  children,
  id,
  divider = true,
  labelledBy,
  wide = false,
  className,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(className)}>
      <Container wide={wide}>
        <div
          style={{
            paddingBlock: 'var(--section-py)',
            borderTop: divider ? 'var(--stroke-hairline) solid var(--color-border)' : undefined,
          }}
        >
          {children}
        </div>
      </Container>
    </section>
  );
}
