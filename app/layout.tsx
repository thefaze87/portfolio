import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { jsonLd, personSchema, webSiteSchema } from '@/lib/schema';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';
import { SITE_URL } from '@/lib/nav';
import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from '@/lib/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  // Root canonical. Every page overrides this with its own path via
  // buildMetadata(); this is the fallback so no route is ever canonical-less.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      'Better systems. Better decisions. Built to scale. Architecture, AI strategy, automation, and fractional technical leadership.',
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
        {/* Preload only the weights that actually render above the fold, so
         * first paint isn't blocked and nothing is fetched speculatively.
         *   - Inter Variable: all body + UI weights in one file.
         *   - Cabinet Medium 500: nav, eyebrow labels, section openers, and
         *     every display heading — .type-display-* set no font-weight, so
         *     they resolve to the lightest available Cabinet face, which is
         *     500.
         *
         * Deliberately NOT preloaded:
         *   - Cabinet Bold 700 — nothing in the codebase requests weight 700.
         *     The only `font-weight: 700` is its own @font-face rule, and bold
         *     prose (<strong> in MDX) resolves to Inter, not Cabinet. It was
         *     preloaded here on the assumption that display headings used it;
         *     they don't, so every visitor paid for a font the page never
         *     activated. Chrome reported it as an unused-preload warning.
         *   - Cabinet Extrabold 800 — used only by .exp-hero-ghost, a 2.5%-
         *     opacity decorative layer on /experience. Never LCP.
         *   - Fraunces Variable — the home h1 only; swaps in fast enough that
         *     preloading it would compete with body text for bandwidth.
         *
         * If a bold display style is ever added, preload 700 again alongside
         * it — the two changes belong in the same commit. */}
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
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, Dark Reader,
       * Demoway, etc.) inject attributes onto <body> before React hydrates,
       * which would otherwise throw a hydration mismatch. This is shallow —
       * it only ignores the body element's own attributes, never its
       * descendants — so real hydration bugs in page content still surface. */}
      <body suppressHydrationWarning>
        {/* Identity graph. Person + WebSite are site-wide facts, so they're
         * emitted once here rather than per-page. Page-specific schemas
         * (Article, FAQPage, BreadcrumbList) belong on their own routes. */}
        <script
          type="application/ld+json"
          // Static, build-time JSON from lib/schema.ts. No user input
          // reaches this string.
          dangerouslySetInnerHTML={{
            __html: jsonLd([personSchema(), webSiteSchema()]),
          }}
        />
        <Header />
        {children}
        <Footer />
      </body>

      {/* Google Analytics 4 — mounted once, here, for every route.
       *
       * The official @next/third-parties component rather than a hand-rolled
       * next/script pair: it emits the gtag bootstrap and the loader at the
       * `afterInteractive` strategy, so nothing competes with hydration, and
       * it is the surface Next.js keeps current as gtag changes.
       *
       * Rendering it here — inside <html>, after <body>, per the Next.js
       * docs — guarantees exactly one initialization. Do not add it to a page
       * or a nested layout as well; a second mount means a second
       * `gtag('config')` and every page_view is counted twice.
       *
       * Gated on the measurement ID being set, so a fork, a preview deploy, or
       * a local checkout without the variable ships no analytics at all rather
       * than a broken tag. See lib/analytics.ts.
       *
       * Route-change page views come from GA4 Enhanced Measurement, not from
       * application code — see lib/analytics.client.ts before adding any
       * page_view tracking. */}
      {isAnalyticsEnabled && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
