import { Text } from '@react-email/components';
import { color, font, space } from '../theme';

/**
 * SectionHeading — the mono kicker that opens a block inside an email.
 *
 * Rendered as <Text> rather than <Heading>: React Email's Heading emits h1–h6,
 * and a transactional email should have exactly one h1 (its subject-equivalent
 * title). Using real headings for every kicker would produce a document with
 * five h2s and no hierarchy, which screen readers announce as noise.
 *
 * `accent` marks the one block that carries the signal colour — the same
 * one-orange-per-viewport rule the site follows.
 */
export function SectionHeading({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: font.mono,
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: accent ? color.accent : color.textSecondary,
        margin: `0 0 ${space[4]} 0`,
      }}
    >
      {children}
    </Text>
  );
}
