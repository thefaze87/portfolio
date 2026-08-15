import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * IndustriesGrid — EXP.02. The breadth of domains, as an editorial index:
 * typography-driven, hairline-ruled grid (3 → 2 → 1 columns). No icons, no
 * logos, no shadows — the names carry it. Server Component.
 *
 * ## The stack row
 *
 * The heading has always promised "industries and systems"; only the
 * industries half was ever delivered. The homepage named zero technologies,
 * which is the one question a recruiter scanning for sixty seconds could not
 * answer without opening the résumé — they screen on stack keywords, and the
 * page gave them nothing to match.
 *
 * Rendered with the same mono chip treatment as the product stack lists and
 * the consulting verticals rather than as a new device.
 *
 * Curated, not derived from career.json's `tech` arrays: those legitimately
 * contain "UX", "Creative Direction", and "Design Systems", which are
 * disciplines rather than technologies, and a union of seven roles would list
 * every CMS Mark has ever touched. This is the durable core, and it must stay
 * consistent with the résumé and with `KNOWS_ABOUT` in lib/schema.ts — the
 * three are read side by side.
 */

const INDUSTRIES = [
  'Healthcare',
  'Retail',
  'Ecommerce',
  'Events',
  'Education',
  'Media',
  'SaaS',
  'Enterprise Software',
  'AI',
] as const;

const CORE_STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Vue',
  '.NET',
  'Laravel',
  'Ruby on Rails',
  'Node.js',
  'Azure',
  'SQL Server',
  'PostgreSQL',
] as const;

export function IndustriesGrid() {
  return (
    <section>
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--container-default)',
          paddingInline: 'var(--container-gutter)',
          paddingBlock: 'var(--section-py)',
          borderTop: 'var(--stroke-hairline) solid var(--color-border)',
        }}
      >
        <SectionLabel>EXP.02</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          Industries and systems I&apos;ve helped build.
        </h2>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            columnGap: 'var(--space-7)',
          }}
        >
          {INDUSTRIES.map((name) => (
            <li
              key={name}
              className="type-h2"
              style={{
                color: 'var(--color-text)',
                borderTop: 'var(--stroke-hairline) solid var(--color-border)',
                paddingBlock: 'var(--space-5)',
              }}
            >
              {name}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <SectionLabel>Core stack</SectionLabel>
          <ul
            className="flex flex-wrap"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              marginTop: 'var(--space-5)',
              gap: 'var(--space-2) var(--space-3)',
            }}
          >
            {CORE_STACK.map((tech) => (
              <li
                key={tech}
                className="type-mono-body"
                style={{
                  color: 'var(--color-text)',
                  paddingBlock: 'var(--space-1)',
                  paddingInline: 'var(--space-3)',
                  border: 'var(--stroke-hairline) solid var(--color-border-strong)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
