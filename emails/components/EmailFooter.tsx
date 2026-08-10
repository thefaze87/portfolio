import { Hr, Link, Section, Text } from '@react-email/components';
import { LINKEDIN_HREF, SITE_LOCATION, SITE_URL } from '@/lib/nav';
import { CALENDLY_HREF } from '@/lib/email';
import { color, link, space, text } from '../theme';

/**
 * EmailFooter — signature block and quiet links.
 *
 * No CTA button, per the brand's restraint rule: a transactional email is
 * correspondence, not a campaign. Links are inline text so they read as a
 * signature rather than as marketing furniture.
 *
 * Calendly renders only when configured. An unconfigured scheduling link is
 * worse than none — it either 404s or points at someone else's calendar.
 */
export function EmailFooter() {
  return (
    <Section style={{ padding: `0 ${space[6]} ${space[6]} ${space[6]}` }}>
      <Hr
        style={{
          borderColor: color.border,
          borderTop: `1px solid ${color.border}`,
          margin: `0 0 ${space[5]} 0`,
        }}
      />

      <Text style={{ ...text.small, color: color.textSecondary }}>
        <Link href={SITE_URL} style={link}>
          Website
        </Link>
        {'  ·  '}
        <Link href={LINKEDIN_HREF} style={link}>
          LinkedIn
        </Link>
        {CALENDLY_HREF ? (
          <>
            {'  ·  '}
            <Link href={CALENDLY_HREF} style={link}>
              Book a call
            </Link>
          </>
        ) : null}
      </Text>

      <Text style={{ ...text.monoLabel, marginTop: space[4] }}>
        © {new Date().getFullYear()} Mark Fasel · {SITE_LOCATION}
      </Text>
    </Section>
  );
}
