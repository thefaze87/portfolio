import { EyebrowLabel } from '@/components/brand/EyebrowLabel';

/**
 * Phase 1-2 smoke-test home page. Replaced in Phase 3 by the real hero,
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
      <EyebrowLabel>Repo initialized · Phase 2</EyebrowLabel>

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
        Scaffold complete. Design system tokens are live and brand primitives are wired. See{' '}
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
        for the full reference. Proceed to Phase 3 in PLAN.md.
      </p>
    </main>
  );
}
