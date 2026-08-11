import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import {
  LegalDocument,
  LegalEffectiveDate,
  LegalList,
  LegalP,
  type LegalSection,
} from '@/components/legal/LegalDocument';
import { buildMetadata } from '@/lib/seo';
import { EMAIL } from '@/lib/email';
import { LEGAL_ENTITY, SITE_LOCATION } from '@/lib/nav';

export const metadata: Metadata = buildMetadata({
  title: 'Terms',
  description: `Terms of use for markfasel.dev — site ownership, intellectual property, and the distinction between information published here and a consulting engagement with ${LEGAL_ENTITY.name}.`,
  path: '/terms',
});

/**
 * Terms of use.
 *
 * ## Scope: the public website, and nothing else
 *
 * The single most important structural decision here is what this page does
 * NOT contain. There are no project-delivery terms, no IP-assignment clauses,
 * no payment schedules, no confidentiality provisions, no termination
 * mechanics. Those belong in a signed services agreement or SOW, negotiated
 * per client, where they can actually be agreed to.
 *
 * Putting them on a public page would be worse than useless: it would suggest
 * a visitor can accept commercial terms by reading a webpage, and it would
 * conflict with whatever the real contract says the moment the two drift.
 *
 * What this page does instead is draw the line — website content is
 * informational, and an engagement starts only under a written agreement.
 * That single clause is what lets /consulting describe process and pricing
 * approach openly without any of it becoming an offer.
 *
 * ## Conservative by construction
 *
 * The warranty and liability language is deliberately restrained, and the
 * governing-law clause names Florida (where the company is formed) without
 * asserting exclusive venue or a jury waiver. Those are terms with real
 * consequences that vary by jurisdiction and by who the counterparty is;
 * over-reaching in a website footer document is how a clause gets read down
 * or struck entirely. See the review note in the phase report.
 *
 * Server Component.
 */

const LAST_UPDATED = 'August 2026';

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'site',
    heading: 'This site',
    body: (
      <LegalP>
        markfasel.dev is owned and operated by {LEGAL_ENTITY.name}, a Florida limited liability
        company based in {SITE_LOCATION}. By using the site you agree to these terms. If you do not
        agree with them, the remedy is simple: do not use the site.
      </LegalP>
    ),
  },
  {
    id: 'informational',
    heading: 'Everything here is informational',
    body: (
      <>
        <LegalP>
          The content on this site — case studies, product write-ups, essays, service descriptions,
          engagement models, and any indication of pricing approach or timelines — is published to
          explain how I work and what I have done. It is written in good faith and kept accurate,
          but it is general information, not advice for your situation.
        </LegalP>
        <LegalP>
          Nothing on this site is professional, legal, financial, or architectural advice for a
          specific system or business. Architecture decisions depend on constraints a webpage cannot
          know about. Do not act on anything here as though it were a recommendation made with
          knowledge of your circumstances.
        </LegalP>
      </>
    ),
  },
  {
    id: 'engagements',
    heading: 'When a consulting engagement actually begins',
    body: (
      <>
        <LegalP>
          This is the clause worth reading carefully, because it protects both of us. Sending a
          message through the{' '}
          <Link href="/contact" className="prose-link">
            contact form
          </Link>
          , emailing me, or having a first conversation does <strong>not</strong>:
        </LegalP>
        <LegalList
          items={[
            'Create a client relationship',
            'Constitute acceptance of your project',
            'Create a consulting agreement of any kind',
            'Guarantee my availability',
            'Guarantee any particular outcome, result, or timeline',
          ]}
        />
        <LegalP>
          An engagement begins only when both parties have agreed in writing to the documents that
          govern it — a proposal, a statement of work, a services agreement, or an equivalent
          written agreement. Those documents, not this page and not anything else on this site,
          define scope, deliverables, fees, ownership, confidentiality, and every other commercial
          term.
        </LegalP>
        <LegalP>
          Where this page and a signed engagement agreement say different things, the engagement
          agreement governs.
        </LegalP>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    body: (
      <>
        <LegalP>
          The content of this site — writing, diagrams, case studies, code samples, the brand mark,
          the wordmark, and the design system itself — belongs to {LEGAL_ENTITY.name} or is used
          with permission. Client names and trademarks that appear in case studies remain the
          property of their owners and are referenced to describe work performed.
        </LegalP>
        <LegalP>
          You may read, quote, and share this material with attribution and a link. You may not
          republish it wholesale, present it as your own, or use it to train a competing commercial
          service without written permission.
        </LegalP>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Reasonable use',
    body: (
      <>
        <LegalP>Use the site the way it was meant to be used. Do not:</LegalP>
        <LegalList
          items={[
            'Attempt to gain unauthorized access to the site or its infrastructure',
            'Use the contact form to send unsolicited commercial messages',
            'Scrape the site in a way that degrades it for other people',
            'Use it for anything unlawful',
          ]}
        />
      </>
    ),
  },
  {
    id: 'external-links',
    heading: 'Links to other sites',
    body: (
      <LegalP>
        This site links to external services and to third-party writing. Those destinations are not
        under my control, and a link is not an endorsement of everything on the other end of it.
        What happens on another company&rsquo;s site is governed by that company&rsquo;s terms.
      </LegalP>
    ),
  },
  {
    id: 'availability',
    heading: 'Availability and accuracy',
    body: (
      <LegalP>
        The site is provided as it is. I do not promise that it will always be available, that it
        will be free of errors, or that every page reflects the very latest state of a project or
        product. Content is maintained in good faith and corrected when I find something wrong,
        which is a commitment to care rather than a warranty.
      </LegalP>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <LegalP>
        To the extent permitted by law, {LEGAL_ENTITY.name} is not liable for losses arising from
        your use of this website or from reliance on its general information. This clause concerns
        the website only. Liability under a signed engagement is addressed in that
        engagement&rsquo;s own agreement, where it can be negotiated properly.
      </LegalP>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: (
      <LegalP>
        {LEGAL_ENTITY.name} is formed in Florida and operates from {SITE_LOCATION}. These website
        terms are governed by the laws of the State of Florida, without regard to its
        conflict-of-law rules. Where an engagement agreement specifies its own governing law or
        dispute-resolution process, that agreement controls for anything arising from the
        engagement.
      </LegalP>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: (
      <LegalP>
        These terms may be updated as the site changes. The current version is always the one
        published here, with the date at the top. Continuing to use the site after a change means
        the updated terms apply.
      </LegalP>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <LegalP>
        Questions about these terms go to{' '}
        <a href={`mailto:${EMAIL.public}`} className="prose-link">
          {EMAIL.public}
        </a>
        . For how information is handled, see the{' '}
        <Link href="/privacy" className="prose-link">
          privacy policy
        </Link>
        .
      </LegalP>
    ),
  },
];

export default function TermsPage() {
  return (
    <main id="main-content">
      <Section divider={false} labelledBy="terms-heading">
        <SectionHeader
          id="terms-heading"
          label="TERMS"
          as="h1"
          size="display-lg"
          title="Terms of use for this website."
          titleMaxCh={22}
          leadMaxCh={62}
          lead={
            <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
              These cover the public site. They deliberately do not cover paid work — a consulting
              engagement runs under its own written agreement, which is where the terms that matter
              are actually negotiated.
            </p>
          }
        />
        <LegalEffectiveDate date={LAST_UPDATED} />
        <LegalDocument sections={SECTIONS} />
      </Section>
    </main>
  );
}
