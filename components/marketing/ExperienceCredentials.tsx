import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { getCredentials } from '@/lib/mdx';

/**
 * ExperienceCredentials — EXP.03. Education and certifications.
 *
 * Content parity with the published résumé: until this shipped, the downloadable
 * PDF stated qualifications the site itself never did, so a visitor comparing
 * the two found the document more complete than the page.
 *
 * ## Rows, not cards
 *
 * Four certifications and two degrees in a card grid would give six boxes the
 * visual weight of six case studies. These are supporting facts — they belong
 * in the same quiet two-column row treatment the career timeline and the
 * closing links already use. Nothing here should compete with EXP.02.
 *
 * The same data feeds `alumniOf` and `hasCredential` on the Person entity
 * (lib/schema.ts). Both read content/experience/credentials.json, so the page
 * and the knowledge graph cannot disagree.
 *
 * Server Component.
 */

interface CredentialRow {
  /** Mono left column — who awarded it. */
  source: string;
  /** Primary line — the award. */
  title: string;
  /** Secondary line: field of study, or location. Omitted for certifications
   *  where the name already says everything the résumé says. */
  detail?: string;
}

function CredentialList({ label, rows }: { label: string; rows: CredentialRow[] }) {
  return (
    <div>
      <span className="type-mono-label" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </span>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          marginTop: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {rows.map((row) => (
          <li
            key={`${row.source}-${row.title}`}
            className="grid grid-cols-1 sm:grid-cols-[14rem_1fr]"
            style={{
              gap: 'var(--space-1) var(--space-6)',
              paddingBlock: 'var(--space-5)',
              borderTop: 'var(--stroke-hairline) solid var(--color-border)',
            }}
          >
            <span
              className="type-mono-label"
              style={{ color: 'var(--color-text-dim)', paddingTop: 'var(--space-1)' }}
            >
              {row.source}
            </span>

            <span>
              <span className="type-h3" style={{ display: 'block' }}>
                {row.title}
              </span>
              {row.detail && (
                <span
                  className="type-body"
                  style={{
                    display: 'block',
                    marginTop: 'var(--space-1)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {row.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceCredentials() {
  const { education, certifications } = getCredentials();

  return (
    <Section labelledBy="experience-credentials">
      <SectionHeader
        id="experience-credentials"
        label="EXP.03"
        title="Education and certifications."
        titleMaxCh={24}
        leadMaxCh={58}
        lead="The formal record, for the readers who need it in writing."
      />

      <div className="flex flex-col" style={{ marginTop: 'var(--space-8)', gap: 'var(--space-8)' }}>
        <CredentialList
          label="Education"
          rows={education.map((entry) => ({
            source: entry.location ? `${entry.institution} · ${entry.location}` : entry.institution,
            title: entry.credential,
            detail: entry.field,
          }))}
        />

        <CredentialList
          label="Certifications"
          rows={certifications.map((entry) => ({
            source: entry.issuer,
            title: entry.name,
          }))}
        />
      </div>
    </Section>
  );
}
