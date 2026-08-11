import { Heading, Hr, Section, Text } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { SectionHeading } from './components/SectionHeading';
import { DetailRow } from './components/DetailRow';
import { MessagePanel } from './components/MessagePanel';
import { SITE_ROLE_SHORT } from '@/lib/email';
import { color, font, space, text } from './theme';

/**
 * Email #2 — visitor acknowledgement.
 *
 * Secondary by design: if this fails the contact form still succeeds, because
 * the message already reached Mark and failing the visitor's submission would
 * be both untrue and pointless.
 *
 * Its actual job is expectation-setting. A visitor who knows a human will read
 * this within two business days does not send a follow-up "did you get this?"
 * three days later. Echoing their submission back gives them a record without
 * requiring them to have kept one.
 *
 * No CTA button. This is correspondence; a "Book a call" button would make it
 * read as a drip sequence and undercut the claim that a person read it.
 */

export interface ContactAcknowledgementProps {
  firstName: string;
  message: string;
  /** Optional on the form; DetailRow drops it when absent. */
  company?: string | undefined;
  /** Required on the form and guaranteed by contactSchema after parse. */
  projectType: string;
  timeline: string;
}

export function ContactAcknowledgement({
  firstName,
  message,
  company,
  projectType,
  timeline,
}: ContactAcknowledgementProps) {
  return (
    <EmailLayout preview="I received your message and will review it personally.">
      <Heading
        as="h1"
        style={{
          fontFamily: font.display,
          fontSize: '22px',
          lineHeight: '1.25',
          color: color.textPrimary,
          margin: `0 0 ${space[5]} 0`,
        }}
      >
        Hi {firstName},
      </Heading>

      <Text style={text.body}>Thanks for reaching out.</Text>

      <Text style={text.body}>
        I received your message and appreciate you taking the time to contact me.
      </Text>

      <Text style={text.body}>
        I&apos;ll personally review your inquiry and, if it looks like a good fit, I&apos;ll follow
        up with next steps or any questions I have.
      </Text>

      <Text style={{ ...text.bodyStrong, marginBottom: space[6] }}>
        I generally respond within 1–2 business days.
      </Text>

      <Hr
        style={{
          borderColor: color.border,
          borderTop: `1px solid ${color.border}`,
          margin: `0 0 ${space[5]} 0`,
        }}
      />

      <Text style={{ ...text.small, marginBottom: space[5] }}>
        Below is a copy of the information you submitted, for your records.
      </Text>

      <SectionHeading>Your message</SectionHeading>
      <MessagePanel>{message}</MessagePanel>

      {/* Always rendered: project type and timeline are required on the form,
       * so this section can no longer be empty. The old `hasDetails` guard
       * existed for when all three were optional and an empty "Details"
       * heading over nothing would have read as a template error. Company
       * still drops out on its own via DetailRow. */}
      <Section style={{ marginBottom: space[5] }}>
        <SectionHeading>Details</SectionHeading>
        <DetailRow label="Company" value={company} />
        <DetailRow label="Project type" value={projectType} />
        <DetailRow label="Timeline" value={timeline} />
      </Section>

      <Hr
        style={{
          borderColor: color.border,
          borderTop: `1px solid ${color.border}`,
          margin: `${space[5]} 0`,
        }}
      />

      <Text style={{ ...text.body, margin: `0 0 ${space[2]} 0` }}>Best,</Text>
      <Text style={{ ...text.bodyStrong, margin: `0 0 ${space[1]} 0` }}>Mark</Text>
      <Text style={{ ...text.monoLabel }}>Mark Fasel · {SITE_ROLE_SHORT}</Text>
    </EmailLayout>
  );
}

/** Plain-text fallback. Same content, same order, no markup. */
export function contactAcknowledgementText(props: ContactAcknowledgementProps): string {
  const details = [
    ['Company', props.company],
    ['Project type', props.projectType],
    ['Timeline', props.timeline],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  return `Hi ${props.firstName},

Thanks for reaching out.

I received your message and appreciate you taking the time to contact me.

I'll personally review your inquiry and, if it looks like a good fit, I'll follow up with next steps or any questions I have.

I generally respond within 1-2 business days.

---

Below is a copy of the information you submitted, for your records.

YOUR MESSAGE
${props.message}
${details ? `\nDETAILS\n${details}\n` : ''}
---

Best,
Mark

Mark Fasel
${SITE_ROLE_SHORT}
`;
}
