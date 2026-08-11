'use client';

import { sendGAEvent } from '@next/third-parties/google';
import {
  isAnalyticsEnabled,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics';

/**
 * The client-side event sender.
 *
 * Separated from lib/analytics.ts because `@next/third-parties/google` is
 * `'use client'` — see the note there. Import this only from Client
 * Components; importing it into a Server Component is a build error, which is
 * the intended guard rail rather than an inconvenience.
 *
 * ## page_view is deliberately not sent from here
 *
 * `<GoogleAnalytics>` runs `gtag('config', id)` once on mount, which sends the
 * initial page_view. It does **not** hook into the router — and that is
 * correct, because GA4's Enhanced Measurement setting "Page changes based on
 * browser history events" (on by default) already emits a page_view for every
 * App Router client-side navigation.
 *
 * So the rule is: **never add a `usePathname` effect that sends `page_view`.**
 * Doing so double-counts every navigation after the first, and the resulting
 * inflation is invisible in the GA4 UI — the numbers just look good.
 *
 * If that GA4 setting is ever turned off, route-change page views disappear
 * entirely and the fix is to turn it back on, not to send them from here.
 */
export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  // Without the measurement ID no script was ever loaded, so the dataLayer
  // does not exist and sendGAEvent would log "GA has not been initialized" on
  // every interaction. Checking here keeps the console clean in development.
  if (!isAnalyticsEnabled) return;

  sendGAEvent('event', name, params);
}
