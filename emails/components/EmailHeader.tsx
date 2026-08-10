import { Column, Img, Row, Section, Text } from '@react-email/components';
import { SITE_ROLE } from '@/lib/nav';
import { EMAIL_LOGO_URL } from '@/lib/email';
import { color, font, space, text } from '../theme';

/**
 * EmailHeader — the brand lockup at the top of every transactional email.
 *
 * Deliberately small. A header that fills the first screen pushes the actual
 * message below the fold in a phone's preview pane, which is where most of
 * these are read.
 *
 * ## The wordmark is text, and the mark is gated
 *
 * The site's mark is an SVG. **Gmail strips SVG entirely**, and most clients
 * block remote images until the reader opts in — so the lockup can never
 * depend on an image to be legible. The wordmark and role line are live text,
 * which also satisfies the "no image-only information" accessibility rule.
 *
 * The PNG mark renders only when `EMAIL_LOGO_URL` is set. Email has no
 * relative base URL, so the value must be a fully qualified public URL; if it
 * 404s, clients with images enabled show a broken-image icon, which is worse
 * than showing nothing. Gating it means the header is correct before the
 * domain is live and improves automatically once it is.
 */
export function EmailHeader() {
  return (
    <Section style={{ padding: `${space[6]} ${space[6]} ${space[5]} ${space[6]}` }}>
      <Row>
        {EMAIL_LOGO_URL ? (
          <Column style={{ width: '40px', verticalAlign: 'middle' }}>
            <Img
              src={EMAIL_LOGO_URL}
              width="28"
              height="28"
              alt=""
              style={{ display: 'block', borderRadius: '2px' }}
            />
          </Column>
        ) : null}
        <Column style={{ verticalAlign: 'middle' }}>
          <Text
            style={{
              fontFamily: font.display,
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: color.textPrimary,
              margin: '0',
            }}
          >
            MARK FASEL
          </Text>
        </Column>
      </Row>

      <Text style={{ ...text.monoLabel, marginTop: space[3] }}>{SITE_ROLE}</Text>
    </Section>
  );
}
