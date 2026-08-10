import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/nav';

/**
 * robots.txt.
 *
 * Allow everything except the internal styleguide (which also carries a
 * noindex meta tag — the two are complementary: robots stops the crawl,
 * noindex stops indexing if it's reached via a link).
 *
 * AI crawlers are deliberately NOT blocked. Discovery through ChatGPT,
 * Claude, and Perplexity is a primary channel for this site, not a leak.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/styleguide'] }],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
