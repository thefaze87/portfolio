import Link from 'next/link';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { PLATFORMS } from '@/lib/nav';

/**
 * ExperienceLinks — EXP.05. The closing call-to-action row: LinkedIn, résumé,
 * and contact. Contact is the page's single orange interactive element
 * (cta-primary); LinkedIn and résumé are restrained ghost buttons — orange
 * stays a signal, not decoration. No platform branding on the LinkedIn link.
 *
 * Server Component.
 *
 * NOTE: the résumé link points at /mark-fasel-resume.pdf — drop that PDF into
 * /public before shipping, or the download will 404.
 */

const LINKEDIN_HREF =
  PLATFORMS.find((p) => p.label === 'LinkedIn')?.href ?? 'https://linkedin.com/in/markfasel';

const RESUME_HREF = '/mark-fasel-resume.pdf';

const CTA_PADDING = { paddingBlock: 'var(--space-3)', paddingInline: 'var(--space-5)' } as const;

export function ExperienceLinks() {
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
        <SectionLabel>EXP.05</SectionLabel>

        <h2 className="type-display-md" style={{ marginTop: 'var(--space-5)', maxWidth: '20ch' }}>
          Let&apos;s work together.
        </h2>

        <p
          className="type-body-lg"
          style={{
            marginTop: 'var(--space-5)',
            maxWidth: '52ch',
            color: 'var(--color-text-muted)',
          }}
        >
          Connect on LinkedIn, take the résumé, or start a conversation.
        </p>

        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
        >
          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost type-body inline-flex items-center"
            style={CTA_PADDING}
          >
            View LinkedIn →<span className="sr-only"> (opens in a new tab)</span>
          </a>

          <a
            href={RESUME_HREF}
            download
            className="cta-ghost type-body inline-flex items-center"
            style={CTA_PADDING}
          >
            Download Résumé
          </a>

          <Link
            href="/contact"
            className="cta-primary type-body inline-flex items-center"
            style={CTA_PADDING}
          >
            Start a conversation →
          </Link>
        </div>
      </div>
    </section>
  );
}
