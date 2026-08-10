import { Body, Container, Head, Html, Preview, Section } from '@react-email/components';
import { EmailFooter } from './EmailFooter';
import { EmailHeader } from './EmailHeader';
import { CONTENT_WIDTH, color, font, space } from '../theme';

/**
 * EmailLayout — the shell every transactional email renders inside.
 *
 * Owns the html/head/body chrome, the preview line, the 600px centred column,
 * and the header/footer. A new email supplies only its content; it cannot
 * accidentally ship different chrome.
 *
 * ## Dark-mode caveat worth knowing
 *
 * This is a dark design, and several clients (notably Outlook on Windows and
 * some Gmail configurations) apply their own colour inversion to email they
 * decide is light-on-dark. `color-scheme` and `supported-color-schemes` in the
 * head tell well-behaved clients the palette is intentional and to leave it
 * alone. Clients that ignore it will still render legibly because contrast is
 * high in both directions — but this is the single largest source of "it looks
 * wrong in my client" reports for dark email, and it cannot be fully solved.
 *
 * The outer Body carries the background colour AND the Container repeats it,
 * because Outlook ignores background on <body> and would otherwise render the
 * column on white.
 */

interface EmailLayoutProps {
  /** The inbox preview line. Shown after the subject in most clients. */
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: color.background,
          margin: '0',
          padding: '0',
          fontFamily: font.sans,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Container
          style={{
            width: '100%',
            maxWidth: `${CONTENT_WIDTH}px`,
            margin: '0 auto',
            backgroundColor: color.background,
          }}
        >
          <EmailHeader />

          {/* Content surface. Sits on --surface so the body separates from the
           * page ground the same way cards do on the site. */}
          <Section
            style={{
              backgroundColor: color.surface,
              border: `1px solid ${color.border}`,
              borderRadius: '4px',
              padding: space[6],
            }}
          >
            {children}
          </Section>

          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}
