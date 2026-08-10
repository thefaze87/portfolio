import { Section, Text } from '@react-email/components';
import { color, space, text } from '../theme';

/**
 * MessagePanel — verbatim visitor-authored text.
 *
 * Set apart with an accent rule so it is unmistakably the person's own words
 * rather than template copy. `whiteSpace: pre-wrap` preserves the paragraph
 * breaks they typed; without it a multi-paragraph message collapses into one
 * block and reads as though they wrote a wall of text.
 *
 * Content is passed as a child, so React escapes it. Visitor input is never
 * interpolated into markup.
 */
export function MessagePanel({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        borderLeft: `2px solid ${color.accent}`,
        paddingLeft: space[5],
        margin: `${space[2]} 0 ${space[5]} 0`,
      }}
    >
      <Text
        style={{
          ...text.bodyStrong,
          whiteSpace: 'pre-wrap',
          margin: '0',
        }}
      >
        {children}
      </Text>
    </Section>
  );
}
