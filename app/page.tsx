/**
 * Phase 1 smoke-test home page. Replaced in Phase 3 by the real hero,
 * services, case studies, etc. Kept minimal and on-system: every value
 * resolves to a token. If you find yourself hardcoding a pixel here,
 * the token is missing — add it to styles/tokens.css first.
 */
export default function Home() {
  return (
    <main
      className="mx-auto"
      style={{
        maxWidth: 'var(--container-default)',
        paddingInline: 'var(--container-gutter)',
        paddingBlock: 'var(--space-9)',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 'var(--space-5)',
            height: 'var(--stroke-thin)',
            background: 'var(--color-accent)',
          }}
        />
        <span className="type-mono-label" style={{ color: 'var(--color-accent)' }}>
          Repo initialized · Phase 1
        </span>
      </div>

      <h1 className="type-display-lg" style={{ marginTop: 'var(--space-5)' }}>
        Mark Fasel
      </h1>

      <p
        className="type-body-lg"
        style={{
          marginTop: 'var(--space-4)',
          maxWidth: '52ch',
          color: 'var(--color-text-muted)',
        }}
      >
        Scaffold complete. Design system tokens are live. See{' '}
        <a
          href="/styleguide"
          style={{
            color: 'var(--color-text)',
            textDecoration: 'underline',
            textUnderlineOffset: 'var(--space-1)',
          }}
        >
          /styleguide
        </a>{' '}
        for the full reference. Proceed to Phase 2 in PLAN.md.
      </p>
    </main>
  );
}
