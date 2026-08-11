import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SectionLabel } from '@/components/brand/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { collectionPageSchema, jsonLd } from '@/lib/schema';
import { getProjectsIndex } from '@/lib/mdx';
import type { ProjectCard } from '@/lib/content-schemas';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description:
    'Platforms architected and built end to end — commerce, location-based experiences, ERP data tooling, design systems, and the architecture behind them.',
  path: '/projects',
});

/**
 * Projects — the independent build record, and the counterpart to /experience.
 *
 *   Experience = what was accomplished professionally over 20+ years.
 *   Projects   = what gets architected and shipped independently.
 *
 * Three tiers with genuinely different visual weight, because presenting a
 * 96-hour funnel build at the same scale as a production commerce platform
 * would flatten the thing the page exists to communicate. Featured projects
 * get full-width cards with highlights; selected work gets a two-column grid;
 * labs get compact rows.
 *
 * Cards without a `caseStudy` render without a CTA rather than linking
 * nowhere. `buildState` splits built / in-development / roadmap so an
 * architecture-stage project never reads as a claim that it already ships.
 *
 * Server Component.
 */

/**
 * The four overlapping capabilities the work demonstrates. Stated explicitly
 * because a reader will not derive them from a list of project cards — and the
 * single most costly misread of this site would be "frontend developer."
 */
const CAPABILITIES = [
  {
    title: 'Product engineering',
    body: 'Taking an idea from concept to production — including the operational tooling and admin surfaces that decide whether it can actually be run.',
  },
  {
    title: 'Systems architecture',
    body: 'Designing domains, integrations, data flows, asynchronous workflows, and the boundaries that let a system keep changing after launch.',
  },
  {
    title: 'Frontend & UX engineering',
    body: 'Deep frontend experience with formal UX training — enough of both to bridge engineering and product design rather than hand off between them.',
  },
  {
    title: 'Full-stack engineering',
    body: 'Frontend, backend, database, integrations, infrastructure, and deployment. The whole path, which is why the projects below exist at all.',
  },
] as const;

/** Chips shared by every tier. */
function StackChips({ stack, max }: { stack: readonly string[]; max?: number }) {
  if (stack.length === 0) return null;
  const shown = max ? stack.slice(0, max) : stack;
  const remainder = max ? stack.length - shown.length : 0;

  return (
    <ul
      className="flex flex-wrap"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: 'var(--space-2) var(--space-3)',
      }}
    >
      {shown.map((tech) => (
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
      {remainder > 0 && (
        <li
          className="type-mono-body nums-tabular"
          style={{
            color: 'var(--color-text-dim)',
            paddingBlock: 'var(--space-1)',
            paddingInline: 'var(--space-3)',
          }}
        >
          +{remainder}
        </li>
      )}
    </ul>
  );
}

/** Status + positioning kicker row. */
function ProjectMeta({ project }: { project: ProjectCard }) {
  return (
    <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-3) var(--space-5)' }}>
      <SectionLabel accent>{project.positioning}</SectionLabel>
      <span className="type-mono-label" style={{ color: 'var(--color-text-dim)' }}>
        {project.status}
      </span>
    </div>
  );
}

/** Tier 1 — full-width, the flagship treatment. */
function FeaturedProject({ project }: { project: ProjectCard }) {
  const href = project.caseStudy ? `/projects/${project.caseStudy}` : null;

  return (
    <Card as="article" padding="lg" interactive={Boolean(href)}>
      <ProjectMeta project={project} />

      <h3
        className="type-display-md card-title"
        style={{ marginTop: 'var(--space-5)', maxWidth: '24ch' }}
      >
        {href ? (
          <Link href={href} style={{ color: 'inherit' }}>
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h3>

      {project.role && (
        <p
          className="type-body-sm"
          style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-dim)' }}
        >
          {project.role}
        </p>
      )}

      <p
        className="type-body-lg"
        style={{
          marginTop: 'var(--space-5)',
          color: 'var(--color-text-muted)',
          maxWidth: '68ch',
        }}
      >
        {project.summary}
      </p>

      {project.highlights.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            maxWidth: '68ch',
          }}
        >
          {project.highlights.map((item) => (
            <li
              key={item}
              className="type-body"
              style={{
                color: 'var(--color-text-muted)',
                display: 'flex',
                gap: 'var(--space-3)',
              }}
            >
              <span aria-hidden="true" style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Build state. The honest split for anything not yet shipped. */}
      {project.buildState && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            marginTop: 'var(--space-7)',
            paddingTop: 'var(--space-6)',
            borderTop: 'var(--stroke-hairline) solid var(--color-border)',
            gap: 'var(--space-6)',
          }}
        >
          {(
            [
              ['Built', project.buildState.built, 'var(--color-accent)'],
              ['In development', project.buildState.inDevelopment, 'var(--color-text-muted)'],
              ['Roadmap', project.buildState.roadmap, 'var(--color-text-dim)'],
            ] as const
          ).map(([label, items, color]) =>
            items.length === 0 ? null : (
              <div key={label}>
                <span className="type-mono-label" style={{ color }}>
                  {label}
                </span>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    marginTop: 'var(--space-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  {items.map((item) => (
                    <li
                      key={item}
                      className="type-body-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}

      {project.stack.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <StackChips stack={project.stack} />
        </div>
      )}

      {href && project.cta && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button href={href} variant="text">
            {project.cta} →
          </Button>
        </div>
      )}
    </Card>
  );
}

/** Tier 2 — two-column grid, medium weight. */
function SelectedProject({ project }: { project: ProjectCard }) {
  const href = project.caseStudy ? `/projects/${project.caseStudy}` : null;

  return (
    <Card as="article" interactive={Boolean(href)}>
      <ProjectMeta project={project} />

      <h3 className="type-h2 card-title" style={{ marginTop: 'var(--space-4)', maxWidth: '24ch' }}>
        {href ? (
          <Link href={href} style={{ color: 'inherit' }}>
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h3>

      <p
        className="type-body"
        style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
      >
        {project.summary}
      </p>

      {project.confidential && (
        <p
          className="type-body-sm"
          style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-dim)' }}
        >
          Detail limited to what can be discussed publicly.
        </p>
      )}

      {project.needsDetail && (
        <p
          className="type-body-sm"
          style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-dim)' }}
        >
          Write-up in progress.
        </p>
      )}

      {project.stack.length > 0 && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <StackChips stack={project.stack} max={6} />
        </div>
      )}

      {href && project.cta && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button href={href} variant="text">
            {project.cta} →
          </Button>
        </div>
      )}
    </Card>
  );
}

/** Tier 3 — compact rows. Present, but never competing for attention. */
function LabProject({ project }: { project: ProjectCard }) {
  return (
    <li
      className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]"
      style={{
        gap: 'var(--space-3) var(--space-7)',
        paddingBlock: 'var(--space-5)',
        borderTop: 'var(--stroke-hairline) solid var(--color-border)',
      }}
    >
      <div>
        <h3 className="type-h3">{project.title}</h3>
        <p
          className="type-mono-label"
          style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-dim)' }}
        >
          {project.positioning} · {project.status}
        </p>
      </div>
      <div>
        <p className="type-body" style={{ color: 'var(--color-text-muted)' }}>
          {project.summary}
        </p>
        {project.stack.length > 0 && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <StackChips stack={project.stack} max={5} />
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProjectsPage() {
  const { featured, selected, labs } = getProjectsIndex();

  // Order matches the page: featured, then selected, then labs.
  const allProjects = [...featured, ...selected, ...labs];

  return (
    <main id="main-content">
      {/* Collection graph. A card with a published case study resolves to the
       * Article node on that page; a card without one carries name +
       * positioning only. Deliberately not typed as CreativeWork/Article at
       * this level — the index describes engagements, and only the ones with a
       * written case study are actually articles. */}
      <script
        type="application/ld+json"
        // Build-time JSON from the validated projects registry. No user input.
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionPageSchema({
              name: 'Projects by Mark Fasel',
              description:
                'Client and independent engineering work — platforms, integrations, and design systems architected by Mark Fasel.',
              path: '/projects',
              items: allProjects.map((project) => ({
                name: project.title,
                description: project.positioning,
                ...(project.caseStudy
                  ? { id: absoluteUrl(`/projects/${project.caseStudy}#article`) }
                  : {}),
              })),
            }),
          ),
        }}
      />

      <Section divider={false} labelledBy="projects-heading">
        <SectionHeader
          id="projects-heading"
          label="PROJECTS"
          as="h1"
          size="display-lg"
          title="What I build when nobody assigns it."
          titleMaxCh={24}
          leadMaxCh={64}
          lead={
            <>
              <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
                Platforms architected end to end — domain model, backend, frontend, integrations,
                infrastructure, and the operational tooling required to actually run them.
              </p>
              <p
                className="type-body-lg"
                style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}
              >
                The career record is on{' '}
                <Link href="/experience" className="prose-link">
                  Experience
                </Link>
                . This is the other half: what twenty years of that produces when the constraint is
                only time. Ventures I own outright are on{' '}
                <Link href="/products" className="prose-link">
                  Products
                </Link>
                .
              </p>
            </>
          }
        />
      </Section>

      {/* The positioning block. Without this, a visitor scanning the cards
       * reads "frontend developer who also does side projects." The four
       * capabilities are what the body of work actually demonstrates, stated
       * once, plainly, before the evidence. */}
      <Section labelledBy="projects-capabilities">
        <SectionHeader
          id="projects-capabilities"
          label="PROJECTS.00"
          title="Four capabilities, one body of work."
          titleMaxCh={24}
          leadMaxCh={62}
          lead="Twenty years building software, then enterprise engineering, then architecture leadership — and now shipping complete products independently. The combination is the point; none of these four stands alone."
        />

        <ul
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-8)',
            gap: 'var(--space-5)',
          }}
        >
          {CAPABILITIES.map((capability, i) => (
            <Card as="li" key={capability.title}>
              <span
                className="type-mono-label nums-tabular"
                style={{ color: 'var(--color-text-dim)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="type-h3" style={{ marginTop: 'var(--space-4)' }}>
                {capability.title}
              </h3>
              <p
                className="type-body"
                style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}
              >
                {capability.body}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Tier 1 */}
      <Section labelledBy="projects-featured">
        <h2 id="projects-featured" className="type-h2">
          Featured case studies
        </h2>
        <div
          style={{
            marginTop: 'var(--space-7)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {featured.map((project) => (
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* Tier 2 */}
      <Section labelledBy="projects-selected">
        <h2 id="projects-selected" className="type-h2">
          Selected engineering work
        </h2>
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-5)' }}
        >
          {selected.map((project) => (
            <SelectedProject key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* Tier 3 */}
      <Section labelledBy="projects-labs">
        <h2 id="projects-labs" className="type-h2">
          Labs
        </h2>
        <p
          className="type-body"
          style={{
            marginTop: 'var(--space-4)',
            color: 'var(--color-text-muted)',
            maxWidth: '58ch',
          }}
        >
          Smaller builds and experiments. Included because execution speed is its own signal, not
          because they are architecture.
        </p>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            marginTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {labs.map((project) => (
            <LabProject key={project.id} project={project} />
          ))}
        </ul>
      </Section>

      <Section labelledBy="projects-cta">
        <SectionHeader
          id="projects-cta"
          label="PROJECTS.CTA"
          title="Need something like this built?"
          titleMaxCh={24}
          leadMaxCh={54}
          lead="If one of these resembles the problem in front of you, the first conversation is usually short and useful."
        />
        <div
          className="flex flex-wrap"
          style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}
        >
          <Button href="/contact" variant="primary">
            Let&apos;s Talk →
          </Button>
          <Button href="/consulting" variant="ghost">
            How I work
          </Button>
        </div>
      </Section>
    </main>
  );
}
