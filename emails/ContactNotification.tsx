import { Heading, Hr, Link, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { SectionHeading } from './components/SectionHeading';
import { DetailRow } from './components/DetailRow';
import { MessagePanel } from './components/MessagePanel';
import { SITE_URL } from '@/lib/nav';
import { color, font, link, space, text } from './theme';

/**
 * Email #1 — internal notification.
 *
 * Sent to the private inbox when the contact form is submitted. This is the
 * critical email: if it fails, the submission is reported as failed, because a
 * visitor being told "sent" when nothing arrived is the worst outcome
 * available.
 *
 * Optimised for one job: deciding whether to reply, from a phone, in ten
 * seconds. So the name and the reply link are the two most prominent elements,
 * qualifying fields sit in a scannable table, and the message is verbatim.
 *
 * Metadata is limited to source page and timestamp. No IP, no user agent —
 * neither helps answer the question and both are personal data with no
 * retention story.
 */

export interface ContactNotificationProps {
  name: string;
  email: string;
  company?: string | undefined;
  role?: string | undefined;
  projectType?: string | undefined;
  budget?: string | undefined;
  timeline?: string | undefined;
  message: string;
  /** Pre-formatted for display. Passed in so the template stays pure and the
   *  rendered output is deterministic for snapshot/preview purposes. */
  receivedAt: string;
}

export function ContactNotification({
  name,
  email,
  company,
  role,
  projectType,
  budget,
  timeline,
  message,
  receivedAt,
}: ContactNotificationProps) {
  return (
    <EmailLayout preview="New contact form submission from markfasel.dev">
      <SectionHeading accent>New inquiry</SectionHeading>

      <Heading
        as="h1"
        style={{
          fontFamily: font.display,
          fontSize: '24px',
          lineHeight: '1.2',
          color: color.textPrimary,
          margin: `0 0 ${space[3]} 0`,
        }}
      >
        {name}
      </Heading>

      <Text style={{ ...text.small, marginBottom: space[5] }}>
        <Link href={`mailto:${email}`} style={link}>
          Reply to {email}
        </Link>
      </Text>

      <Hr
        style={{
          borderColor: color.border,
          borderTop: `1px solid ${color.border}`,
          margin: `0 0 ${space[5]} 0`,
        }}
      />

      <SectionHeading>Submission</SectionHeading>

      {/* Every possible field is listed; DetailRow drops the empty ones. */}
      <Section style={{ marginBottom: space[5] }}>
        <DetailRow label="Name" value={name} />
        <DetailRow label="Email" value={email} />
        <DetailRow label="Company" value={company} />
        <DetailRow label="Role" value={role} />
        <DetailRow label="Project type" value={projectType} />
        <DetailRow label="Budget" value={budget} />
        <DetailRow label="Timeline" value={timeline} />
      </Section>

      <SectionHeading>Message</SectionHeading>
      <MessagePanel>{message}</MessagePanel>

      <Hr
        style={{
          borderColor: color.border,
          borderTop: `1px solid ${color.border}`,
          margin: `${space[5]} 0`,
        }}
      />

      <Text style={{ ...text.monoLabel }}>
        Received from {SITE_URL}/contact · {receivedAt}
      </Text>
    </EmailLayout>
  );
}

/**
 * Plain-text fallback.
 *
 * Hand-authored rather than machine-derived from the JSX. React Email's
 * plainText renderer produces a serviceable transcript, but this email is read
 * under time pressure and the text version benefits from a different
 * order — reply address first, metadata last. Both versions are sent; clients
 * choose.
 */
export function contactNotificationText(props: ContactNotificationProps): string {
  const fields = [
    ['Name', props.name],
    ['Email', props.email],
    ['Company', props.company],
    ['Role', props.role],
    ['Project type', props.projectType],
    ['Budget', props.budget],
    ['Timeline', props.timeline],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  return `NEW INQUIRY — ${props.name}

Reply to: ${props.email}

SUBMISSION
${fields}

MESSAGE
${props.message}

---
Received from ${SITE_URL}/contact
${props.receivedAt}
`;
}
