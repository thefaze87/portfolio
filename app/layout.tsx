import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://markfasel.com'),
  title: {
    default: 'Mark Fasel — Solutions Architect & AI Strategist',
    template: '%s · Mark Fasel',
  },
  description:
    'Solutions architect and AI strategist with 20+ years designing enterprise systems. Architecture, AI strategy, automation, and fractional leadership.',
  authors: [{ name: 'Mark Fasel' }],
  creator: 'Mark Fasel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://markfasel.com',
    siteName: 'Mark Fasel',
    title: 'Mark Fasel — Solutions Architect & AI Strategist',
    description:
      'Better systems. Better decisions. Built to scale. Architecture, AI strategy, automation, and fractional leadership.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@markfasel',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload only above-the-fold weights so first paint isn't blocked
         * by font loading.
         *   - Inter Variable: all body + UI weights in one file.
         *   - Cabinet Medium 500: nav, eyebrow labels, section openers.
         *   - Cabinet Bold 700: display-lg and display-md headings — these
         *     appear above the fold on the home hero and every page header,
         *     so a late-arriving swap would shift the LCP element.
         * Cabinet Extrabold 800 and Fraunces Variable lazy-load via swap. */}
        <link
          rel="preload"
          href="/fonts/inter-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cabinet-grotesk-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cabinet-grotesk-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
