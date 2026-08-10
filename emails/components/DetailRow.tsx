import { Column, Row, Text } from '@react-email/components';
import { color, font, space, text } from '../theme';

/**
 * DetailRow — one label/value pair in a submission summary.
 *
 * Renders nothing when `value` is empty. That is the mechanism that keeps
 * optional contact fields (company, role, budget, timeline) from appearing as
 * blank rows — the caller lists every possible field and the component decides
 * what survives, rather than each email hand-rolling its own conditionals.
 *
 * Built on Row/Column, which React Email emits as a table. Tables are the only
 * layout primitive Outlook renders predictably; flexbox and grid are ignored.
 */
export function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <Row style={{ marginBottom: space[3] }}>
      <Column style={{ width: '140px', verticalAlign: 'top', paddingRight: space[4] }}>
        <Text
          style={{
            fontFamily: font.mono,
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: color.textSecondary,
            margin: '0',
          }}
        >
          {label}
        </Text>
      </Column>
      <Column style={{ verticalAlign: 'top' }}>
        <Text style={{ ...text.small, color: color.textPrimary }}>{value}</Text>
      </Column>
    </Row>
  );
}
