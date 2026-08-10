/**
 * Renders both transactional emails to disk for visual review.
 * Not part of the build — a developer tool. Run with:
 *   npx tsx scripts/preview-emails.mts
 */
import { render } from '@react-email/components';
import fs from 'node:fs';
import path from 'node:path';
import { ContactNotification, contactNotificationText } from '../emails/ContactNotification';
import {
  ContactAcknowledgement,
  contactAcknowledgementText,
} from '../emails/ContactAcknowledgement';

const OUT = process.env.EMAIL_PREVIEW_DIR ?? '.email-preview';
fs.mkdirSync(OUT, { recursive: true });

// Full submission — every optional field populated.
const full = {
  name: 'Sarah Chen',
  email: 'sarah.chen@northwindhealth.com',
  company: 'Northwind Health',
  role: 'VP Engineering',
  projectType: 'Architecture advisory',
  budget: '$15,000–$30,000',
  timeline: 'Within 1–3 months',
  message:
    'We run three clinical platforms that were acquired separately and never properly integrated.\n\nPatient records live in two of them and neither is authoritative. Our team has built reconciliation tooling twice and it keeps drifting.\n\nWe need someone to tell us where the boundaries should actually be before we spend another quarter on this.',
  receivedAt: 'Aug 8, 2026, 2:14 PM',
};

// Minimal submission — only the three required fields.
const minimal = {
  name: 'Tom',
  email: 'tom@example.com',
  message: 'Do you take on shorter engagements? We have a two-week question.',
  receivedAt: 'Aug 8, 2026, 2:20 PM',
};

const files: [string, string][] = [
  ['notification-full.html', await render(ContactNotification(full))],
  ['notification-minimal.html', await render(ContactNotification(minimal))],
  ['notification-full.txt', contactNotificationText(full)],
  [
    'acknowledgement-full.html',
    await render(
      ContactAcknowledgement({
        firstName: 'Sarah',
        message: full.message,
        company: full.company,
        projectType: full.projectType,
        timeline: full.timeline,
      }),
    ),
  ],
  [
    'acknowledgement-minimal.html',
    await render(ContactAcknowledgement({ firstName: 'Tom', message: minimal.message })),
  ],
  [
    'acknowledgement-full.txt',
    contactAcknowledgementText({
      firstName: 'Sarah',
      message: full.message,
      company: full.company,
      projectType: full.projectType,
      timeline: full.timeline,
    }),
  ],
];

for (const [name, contents] of files) {
  fs.writeFileSync(path.join(OUT, name), contents);
  console.log(`  ${name.padEnd(30)} ${(contents.length / 1024).toFixed(1)}KB`);
}
