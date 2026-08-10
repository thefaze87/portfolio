import { SectionLabel } from '@/components/brand/SectionLabel';

/**
 * ArticleHeader — the masthead for an essay or case study.
 *
 * Kicker (pillar or client) · title · standfirst · metadata row. The metadata
 * row uses a <dl> so the date and reading time are programmatically labelled
 * rather than being a bare string of text with separators.
 *
 * Server Component.
 */

interface MetaItem {
  label: string;
  value: string;
  /** Renders as <time datetime>. */
  dateTime?: string;
}

interface ArticleHeaderProps {
  kicker: string;
  title: string;
  standfirst: string;
  meta: readonly MetaItem[];
  /** Stack or tag chips, shown below the metadata row. */
  chips?: readonly string[];
}

export function ArticleHeader({ kicker, title, standfirst, meta, chips }: ArticleHeaderProps) {
  return (
    <header>
      <SectionLabel accent>{kicker}</SectionLabel>

      <h1 className="type-display-lg" style={{ marginTop: 'var(--space-5)', maxWidth: '22ch' }}>
        {title}
      </h1>

      <p
        className="type-body-lg"
        style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', maxWidth: '60ch' }}
      >
        {standfirst}
      </p>

      <dl
        className="flex flex-wrap"
        style={{
          margin: 0,
          marginTop: 'var(--space-7)',
          paddingTop: 'var(--space-5)',
          borderTop: 'var(--stroke-hairline) solid var(--color-border)',
          gap: 'var(--space-3) var(--space-7)',
        }}
      >
        {meta.map((item) => (
          <div key={item.label} className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
            <dt className="type-mono-label" style={{ color: 'var(--color-text-dim)' }}>
              {item.label}
            </dt>
            <dd
              className="type-body-sm nums-tabular"
              style={{ margin: 0, color: 'var(--color-text)' }}
            >
              {item.dateTime ? <time dateTime={item.dateTime}>{item.value}</time> : item.value}
            </dd>
          </div>
        ))}
      </dl>

      {chips && chips.length > 0 && (
        <ul
          className="flex flex-wrap"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-6)',
            gap: 'var(--space-2) var(--space-3)',
          }}
        >
          {chips.map((chip) => (
            <li
              key={chip}
              className="type-mono-body"
              style={{
                color: 'var(--color-text)',
                paddingBlock: 'var(--space-1)',
                paddingInline: 'var(--space-3)',
                border: 'var(--stroke-hairline) solid var(--color-border-strong)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
