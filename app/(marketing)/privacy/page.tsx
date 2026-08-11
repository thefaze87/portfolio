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
import { LEGAL_ENTITY, NEWSLETTER, PLATFORMS, SITE_LOCATION } from '@/lib/nav';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy',
  description: `How markfasel.dev handles information from the contact form, what analytics and email services are used, and how to reach ${LEGAL_ENTITY.name} with a privacy question.`,
  path: '/privacy',
});

/**
 * Privacy policy.
 *
 * ## This describes the site that exists
 *
 * Every claim below was written against the actual implementation, not from a
 * template. Two disclosures in particular came out of reading the code rather
 * than assuming:
 *
 *   - The contact Server Action derives the visitor's IP from the
 *     x-forwarded-for / x-real-ip headers to key the rate limiter
 *     (lib/rate-limit.ts). A boilerplate policy would not mention it.
 *   - The `send_attempt` log line records the submitter's name and email
 *     address (app/(marketing)/contact/actions.tsx). That is server-side
 *     diagnostic logging of personal data and it is disclosed as such.
 *
 * Equally deliberate is what is NOT claimed: no retention schedule, no
 * deletion workflow, no GDPR/CCPA compliance statement, no cookie-consent
 * banner. None of those are implemented, and a policy that describes controls
 * that do not exist is worse than no policy — it is a false statement about
 * how a visitor's data is handled.
 *
 * ## Keeping it true
 *
 * The service list is the part most likely to go stale. If a provider is
 * added or removed — a CRM, an analytics tool, a consent manager — this page
 * changes in the same commit. Treat it like lib/nav.ts: the site and the
 * disclosure move together.
 *
 * Server Component.
 */

const LAST_UPDATED = 'August 2026';

const EXTERNAL_PLATFORMS = PLATFORMS.map((p) => p.label).join(', ');

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'who',
    heading: 'Who runs this site',
    body: (
      <>
        <LegalP>
          markfasel.dev is operated by {LEGAL_ENTITY.name}, a Florida limited liability company
          based in {SITE_LOCATION}. Throughout this page, &ldquo;I&rdquo; and &ldquo;we&rdquo; refer
          to that company.
        </LegalP>
        <LegalP>
          This is a small professional site. It has no user accounts, no logins, no advertising
          network, and no e-commerce. The only place it asks for information is the contact form.
        </LegalP>
      </>
    ),
  },
  {
    id: 'information-you-provide',
    heading: 'Information you provide',
    body: (
      <>
        <LegalP>
          The{' '}
          <Link href="/contact" className="prose-link">
            contact form
          </Link>{' '}
          collects:
        </LegalP>
        <LegalList
          items={[
            'Name',
            'Email address',
            'Company (optional)',
            'Role (optional)',
            'Project type',
            'Budget range',
            'Timeline',
            'Your message',
          ]}
        />
        <LegalP>
          There are no hidden fields collecting anything else. If you email me directly instead, I
          receive whatever your message contains.
        </LegalP>
      </>
    ),
  },
  {
    id: 'how-its-used',
    heading: 'How that information is used',
    body: (
      <>
        <LegalP>What you submit through the form is used to:</LegalP>
        <LegalList
          items={[
            'Reply to your inquiry',
            'Evaluate a potential consulting or project engagement',
            'Respond to an employment, recruiting, or speaking opportunity',
            'Continue the conversation that follows',
          ]}
        />
        <LegalP>
          <strong>Submitting the form does not subscribe you to anything.</strong> There is no
          marketing list behind it. The newsletter is a separate, opt-in service you join yourself
          on Substack — the form and the newsletter share no data.
        </LegalP>
      </>
    ),
  },
  {
    id: 'email-delivery',
    heading: 'Email delivery (Resend)',
    body: (
      <>
        <LegalP>
          Contact-form submissions are delivered by email using{' '}
          <a
            href="https://resend.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Resend
          </a>
          , a transactional email provider. Two messages are sent: a notification to my inbox
          containing what you submitted, and an acknowledgement to the address you gave so you have
          a record that it went through.
        </LegalP>
        <LegalP>
          Resend processes that message content in order to deliver it, and is governed by its own
          privacy policy. Delivered mail then lives in my email account like any other
          correspondence.
        </LegalP>
      </>
    ),
  },
  {
    id: 'server-logs',
    heading: 'Server logs and abuse prevention',
    body: (
      <>
        <LegalP>
          Two things happen server-side when you submit the form, and both are worth stating plainly
          rather than burying:
        </LegalP>
        <LegalList
          items={[
            <>
              <strong>Rate limiting.</strong> Your IP address is read from the request in order to
              limit how many messages can be sent from one source in a short window. It is held in
              server memory for the length of that window and is not written to logs or stored
              anywhere.
            </>,
            <>
              <strong>Diagnostic logging.</strong> When a submission is processed, a log entry
              records the event along with the name and email address on it, so that a delivery
              failure can be traced and fixed. These logs are retained by the hosting platform and
              are visible only to me.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'analytics',
    heading: 'Analytics (Google Analytics 4)',
    body: (
      <>
        <LegalP>
          This site uses Google Analytics 4 to understand how it is used — which pages people read,
          and whether anyone finds what they came for. At a high level, Analytics collects:
        </LegalP>
        <LegalList
          items={[
            'Pages viewed and how you moved between them',
            'Session and activity information, such as visit duration',
            'Approximate geographic location, derived from IP address',
            'Browser, device, and operating-system information',
            'How you arrived at the site, such as a search engine or a link',
          ]}
        />
        <LegalP>
          Analytics is used in aggregate. I am interested in whether an essay was read, not in who
          read it, and I do not attempt to identify individual visitors or connect analytics data to
          a contact-form submission. Google&rsquo;s handling of this data is governed by its own{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            privacy policy
          </a>
          .
        </LegalP>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    body: (
      <>
        <LegalP>
          Google Analytics sets cookies in your browser to recognise a returning session. That is
          the only cookie-setting technology on the site — there are no advertising cookies, no
          tracking pixels from other companies, and no cross-site profiling.
        </LegalP>
        <LegalP>
          There is currently no cookie-consent banner on this site. You can block or delete cookies
          in your browser settings, or use{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Google&rsquo;s opt-out browser add-on
          </a>
          , and the site will work exactly as it does now.
        </LegalP>
      </>
    ),
  },
  {
    id: 'hosting',
    heading: 'Hosting (Vercel)',
    body: (
      <LegalP>
        The site is hosted on{' '}
        <a
          href="https://vercel.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link"
        >
          Vercel
        </a>
        . As the infrastructure provider, Vercel processes requests to the site and retains
        operational logs, which is what makes the diagnostic logging described above possible. Its
        handling of that data is governed by its own privacy policy.
      </LegalP>
    ),
  },
  {
    id: 'external-links',
    heading: 'Links to other services',
    body: (
      <LegalP>
        The site links out to {EXTERNAL_PLATFORMS} — including the {NEWSLETTER.name} newsletter on
        Substack. Those are third-party services with their own privacy policies and their own data
        practices. Once you follow a link off this site, nothing here applies to what happens next.
      </LegalP>
    ),
  },
  {
    id: 'sharing',
    heading: 'Sharing and selling',
    body: (
      <LegalP>
        {LEGAL_ENTITY.name} does not sell your personal information, and does not share what you
        submit through the contact form with anyone other than the service providers named on this
        page, who process it on my behalf in order to run the site. The exception is the ordinary
        one: information may be disclosed if required by law.
      </LegalP>
    ),
  },
  {
    id: 'questions',
    heading: 'Questions, corrections, and removal',
    body: (
      <LegalP>
        If you want to know what I hold about you, have it corrected, or have it deleted, email{' '}
        <a href={`mailto:${EMAIL.public}`} className="prose-link">
          {EMAIL.public}
        </a>{' '}
        and say so. This is a one-person practice — the request comes to me directly, and I will act
        on it.
      </LegalP>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <LegalP>
        This page describes the site as it works today. When the tools behind it change — a new
        service, a removed one — this page is updated in the same change, and the date at the top
        moves with it.
      </LegalP>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <Section divider={false} labelledBy="privacy-heading">
        <SectionHeader
          id="privacy-heading"
          label="PRIVACY"
          as="h1"
          size="display-lg"
          title="What this site collects, and why."
          titleMaxCh={22}
          leadMaxCh={62}
          lead={
            <p className="type-body-lg" style={{ color: 'var(--color-text)' }}>
              A plain-language account of the information markfasel.dev handles. It is short because
              the site does very little: there are no accounts, no advertising, and one form.
            </p>
          }
        />
        <LegalEffectiveDate date={LAST_UPDATED} />
        <LegalDocument sections={SECTIONS} />
      </Section>
    </main>
  );
}
