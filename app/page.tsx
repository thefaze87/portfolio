import { EyebrowLabel } from '@/components/brand/EyebrowLabel';

/**
 * Placeholder home — a hero text block inside the Phase 3 navigation shell
 * (Header + Footer come from the root layout). Replaced by the real hero,
 * services, case studies, etc. in later phases. Every value resolves to a
 * token; if you reach for a hardcoded pixel, add the token to tokens.css first.
 */
export default function Home() {
  return (
    <main
      id="main-content"
      className="mx-auto"
      style={{
        maxWidth: 'var(--container-default)',
        paddingInline: 'var(--container-gutter)',
        paddingBlock: 'var(--space-10)',
      }}
    >
      <EyebrowLabel>Solutions Architect · AI Strategist</EyebrowLabel>

      <h1 className="type-display-xl" style={{ marginTop: 'var(--space-5)', maxWidth: '16ch' }}>
        Better systems. Better decisions.
      </h1>

      <p
        className="type-body-lg"
        style={{
          marginTop: 'var(--space-5)',
          maxWidth: '52ch',
          color: 'var(--color-text-muted)',
        }}
      >
        Navigation shell is live — header, mobile drawer, and footer wrap every page. The hero
        diagram and homepage sections land in later phases. See{' '}
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
        for the full component reference.
      </p>
    </main>
  );
}
