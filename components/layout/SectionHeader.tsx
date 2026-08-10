import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * SectionHeader — the `label → heading → lead` triple that opens nearly every
 * section on the site. Previously hand-assembled per section, which is why
 * the gap between label and heading drifted between components.
 *
 * Props:
 *   - `label` — the mono figure tag (ARCH.01, WORK.01, …). Optional.
 *   - `title` — the heading text.
 *   - `as` — heading level. Defaults to h2; pass 'h1' for a page opener.
 *   - `size` — type scale. Defaults to display-md (section opener); pass
 *     'display-lg' for page titles or 'h2' for quieter sub-sections.
 *   - `lead` — the paragraph(s) below the heading. Accepts a string or nodes.
 *   - `titleMaxCh` / `leadMaxCh` — editorial measure caps, in ch.
 *
 * Server Component.
 */
interface SectionHeaderProps {
  title: React.ReactNode;
  id?: string;
  label?: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display-lg' | 'display-md' | 'h2';
  lead?: React.ReactNode;
  titleMaxCh?: number;
  leadMaxCh?: number;
}

export function SectionHeader({
  title,
  id,
  label,
  as: Heading = 'h2',
  size = 'display-md',
  lead,
  titleMaxCh = 22,
  leadMaxCh = 58,
}: SectionHeaderProps) {
  return (
    <>
      {label && <SectionLabel>{label}</SectionLabel>}

      <Heading
        id={id}
        className={`type-${size}`}
        style={{ marginTop: label ? 'var(--space-5)' : 0, maxWidth: `${titleMaxCh}ch` }}
      >
        {title}
      </Heading>

      {lead && (
        <div style={{ marginTop: 'var(--space-6)', maxWidth: `${leadMaxCh}ch` }}>
          {typeof lead === 'string' ? (
            <p className="type-body-lg" style={{ color: 'var(--color-text-muted)' }}>
              {lead}
            </p>
          ) : (
            lead
          )}
        </div>
      )}
    </>
  );
}
