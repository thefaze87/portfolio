import { EMAIL } from '@/lib/email';
import { getCredentials, getProducts, getProjectsIndex } from '@/lib/mdx';
import {
  LEGAL_ENTITY,
  NEWSLETTER,
  PLATFORMS,
  RESUME,
  SITE_LOCATION,
  SITE_ROLE,
  SITE_URL,
} from '@/lib/nav';
import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/seo';
import careerData from '@/content/experience/career.json';

/**
 * /llms.txt — a machine-readable summary of this site for language models.
 *
 * The emerging convention (llmstxt.org) is a Markdown digest an LLM can read
 * instead of crawling and re-deriving the site. It is not yet honoured by any
 * major model provider; it is here because the cost is one generated route and
 * the downside of being early is nothing.
 *
 * ## Generated, never authored
 *
 * Every fact below is read from the same registries the pages render from —
 * career.json, the product and project indexes, credentials.json, nav.ts. A
 * hand-written version of this file would be a second source of truth that
 * silently goes stale, which is the exact failure this file exists to prevent.
 *
 * ## Deliberately a summary
 *
 * Not a dump. Essay and case-study bodies are not inlined — the point is to
 * give a model an accurate map plus the URLs to fetch, not to duplicate the
 * site in a text file that then has to be kept in sync.
 *
 * Served as text/plain: llms.txt is Markdown by convention, but every consumer
 * fetches it raw, and text/plain is what stops a browser trying to download it.
 */

export const dynamic = 'force-static';

function section(heading: string, lines: string[]): string {
  return lines.length > 0 ? `## ${heading}\n\n${lines.join('\n')}\n` : '';
}

/**
 * Append a full stop unless the text already ends in punctuation.
 *
 * Taglines and positioning lines are authored copy: most are fragments with no
 * terminal punctuation ("Trust, measured and earned"), but some are complete
 * sentences that end in a period ("The next product is already in motion.").
 * Concatenating "." unconditionally turned the second kind into "motion..".
 */
function sentence(text: string): string {
  return /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
}

export function GET(): Response {
  const { roles, parallel } = careerData as {
    roles: { org: string; role: string; dates: string }[];
    parallel: { org: string; role: string; dates: string };
  };
  const { education, certifications } = getCredentials();
  const products = getProducts();
  const { featured, selected, labs } = getProjectsIndex();

  const current = roles[0];

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_TAGLINE}. ${SITE_LOCATION}, United States.`,
    '',
    `${SITE_NAME} is a solutions architect and engineering leader with 20+ years designing`,
    `enterprise systems across healthcare, retail, e-commerce, media, education, finance, and`,
    `event technology. Work spans architecture, AI strategy, platform modernization, systems`,
    `integration, and technical leadership.`,
    '',
    `- Canonical site: ${SITE_URL}`,
    `- Roles: ${SITE_ROLE}`,
    ...(current ? [`- Current position: ${current.role}, ${current.org} (${current.dates})`] : []),
    `- Independent practice: ${LEGAL_ENTITY.name}, ${parallel.role} (${parallel.dates}) — the legal entity behind the consulting and product work`,
    `- Contact: ${EMAIL.public}`,
    ...(RESUME.available ? [`- Résumé (PDF): ${absoluteUrl(RESUME.href)}`] : []),
    '',

    section('Expertise', [
      '- Solution and enterprise architecture; system boundaries, API contracts, integration design',
      '- AI strategy and applied automation',
      '- Frontend architecture and design systems at organizational scale',
      '- Platform modernization and legacy migration',
      '- Engineering leadership, architecture review, and technical mentorship',
      '- Accessibility (WCAG 2.2) governance',
      '',
      'Primary technologies: React, Vue, TypeScript, Next.js, Laravel, Ruby on Rails, .NET,',
      'Node.js, Azure, SQL Server, PostgreSQL.',
    ]),

    section('Experience', [
      ...roles.map((r) => `- ${r.dates} — ${r.role}, ${r.org}`),
      `- ${parallel.dates} — ${parallel.role}, ${parallel.org}`,
      '',
      `Full record: ${absoluteUrl('/experience')}`,
    ]),

    section('Education and certifications', [
      ...education.map((e) => `- ${e.credential}, ${e.field} — ${e.institution}`),
      ...certifications.map((c) => `- ${c.name} — ${c.issuer}`),
    ]),

    section('Products', [
      `Ventures owned and built through ${LEGAL_ENTITY.name}.`,
      '',
      ...products.map(
        (p) =>
          `- ${p.name} (${p.status}) — ${sentence(p.tagline)}` +
          (p.hasDetail ? ` ${absoluteUrl(`/products/${p.id}`)}` : ''),
      ),
      '',
      `Index: ${absoluteUrl('/products')}`,
    ]),

    section('Projects', [
      'Client and independent engineering engagements.',
      '',
      ...[...featured, ...selected, ...labs].map(
        (p) =>
          `- ${p.title} — ${sentence(p.positioning)}` +
          (p.caseStudy ? ` ${absoluteUrl(`/projects/${p.caseStudy}`)}` : ''),
      ),
      '',
      `Index: ${absoluteUrl('/projects')}`,
    ]),

    section('Writing', [
      `Essays on architecture, systems thinking, AI, and engineering leadership.`,
      '',
      `- Newsletter (canonical publisher): ${NEWSLETTER.name} — ${NEWSLETTER.href}`,
      `- Site archive and index: ${absoluteUrl('/writing')}`,
      '',
      'Posts published to the newsletter are canonical to Substack; the site indexes and links',
      'to them rather than reproducing them.',
    ]),

    section('Consulting', [
      'Two engagement paths:',
      '',
      '1. Technology and architecture advisory — architecture review, AI strategy, platform',
      '   modernization, integration architecture, fractional technical leadership.',
      '2. AI automation for growing businesses — workflow automation, AI-assisted operations,',
      '   systems integration, custom internal tools.',
      '',
      `Details: ${absoluteUrl('/consulting')}`,
      `Enquiries: ${absoluteUrl('/contact')}`,
    ]),

    section(
      'Profiles',
      PLATFORMS.map((p) => `- ${p.label}: ${p.href}`),
    ),

    section('Key pages', [
      `- About: ${absoluteUrl('/about')}`,
      `- Experience: ${absoluteUrl('/experience')}`,
      `- Projects: ${absoluteUrl('/projects')}`,
      `- Products: ${absoluteUrl('/products')}`,
      `- Writing: ${absoluteUrl('/writing')}`,
      `- Consulting: ${absoluteUrl('/consulting')}`,
      `- Contact: ${absoluteUrl('/contact')}`,
      `- Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    ]),
  ]
    .join('\n')
    // The section() helper returns '' for an empty section, and each block
    // already ends with a newline — both leave runs of blank lines behind.
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return new Response(`${body}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
