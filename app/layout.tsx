import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

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
  icons: {
    // SVG first for modern browsers (orange #FF6B35 mark — has contrast against
    // both light and dark tab bars, never vanishes). .ico is the legacy
    // fallback. apple-touch is the white mark on the dark square for home screens.
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
      {/* suppressHydrationWarning: browser extensions (Grammarly, Dark Reader,
       * Demoway, etc.) inject attributes onto <body> before React hydrates,
       * which would otherwise throw a hydration mismatch. This is shallow —
       * it only ignores the body element's own attributes, never its
       * descendants — so real hydration bugs in page content still surface. */}
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
