export default function Home() {
  return (
    <main style={{ padding: 96, maxWidth: 1280, margin: '0 auto' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--color-accent)',
        }}
      >
        — REPO INITIALIZED
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 64,
          marginTop: 24,
          letterSpacing: '-0.025em',
        }}
      >
        Mark Fasel
      </h1>
      <p
        style={{ color: 'var(--color-text-muted)', marginTop: 16, maxWidth: 480, lineHeight: 1.65 }}
      >
        Scaffold complete. Proceed to Phase 1 in PLAN.md.
      </p>
    </main>
  );
}
