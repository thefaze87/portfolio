import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/nav';

/**
 * Metadata helpers. Every route builds its metadata through `buildMetadata`
 * so canonical URLs, Open Graph, and Twitter cards can never be forgotten on
 * a page-by-page basis — the failure mode of hand-rolled per-route metadata.
 *
 * `metadataBase` is set once in the root layout; the `canonical` and OG `url`
 * values here are root-relative and resolve against it.
 */

export const SITE_NAME = 'Mark Fasel';
export const SITE_TAGLINE = 'Solutions Architect & AI Strategist';
export const SITE_DESCRIPTION =
  'Solutions architect and AI strategist with 20+ years designing enterprise systems. Architecture, AI strategy, automation, and fractional technical leadership.';

/**
 * The default social card, referenced explicitly.
 *
 * Next's file-based `opengraph-image` convention only auto-populates routes
 * that don't declare their own `openGraph` object. Every route built through
 * `buildMetadata` declares one — so without naming the image here, only `/`
 * would ship a card and every other page would share as a blank rectangle.
 * That was the pre-existing bug on the whole site; don't remove this.
 */
const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Mark Fasel — Solutions Architect & AI Strategist',
};

interface BuildMetadataOptions {
  /** Page title, without the site suffix — the layout template appends it. */
  title: string;
  description: string;
  /** Root-relative path, e.g. '/contact'. Used for canonical + OG url. */
  path: string;
  /** Long-form content sets 'article'. Everything else is a website. */
  type?: 'website' | 'article';
  /** Set true on routes that must never be indexed (styleguide, previews). */
  noIndex?: boolean;
  /**
   * Absolute URL that supersedes this page as the canonical version.
   *
   * Only for content republished on a platform that owns the original — today
   * that means an essay cross-posted to Substack. Pointing the canonical off
   * this domain hands the search ranking to that platform, so it must be a
   * deliberate per-page decision, never a default.
   */
  canonicalUrl?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  noIndex = false,
  canonicalUrl,
}: BuildMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl ?? path },
    openGraph: {
      type,
      locale: 'en_US',
      url: path,
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: { index: false, follow: false },
          },
        }
      : {}),
  };
}

/** Absolute URL for a root-relative path. For JSON-LD, feeds, and sitemaps,
 *  which all require fully-qualified URLs. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
