import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/nav';
import { getAllProjects, getAllEssays, getProducts } from '@/lib/mdx';

/**
 * Sitemap.
 *
 * Static routes are listed explicitly; content routes are generated from the
 * MDX collections, so publishing an essay adds it to the sitemap with no
 * second step to forget. Drafts are already excluded by the loaders in
 * production, so they can never leak in here.
 *
 * /styleguide is deliberately absent: it is noindex'd.
 */

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified?: Date;
};

const STATIC_ROUTES: readonly Entry[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/projects', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/products', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/consulting', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/writing', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/experience', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
];

/** Parse a YYYY-MM-DD content date into a Date at UTC midnight. */
function contentDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: route.lastModified ?? now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const caseStudies = getAllProjects().map((study) => ({
    url: new URL(`/projects/${study.slug}`, SITE_URL).toString(),
    lastModified: contentDate(study.frontmatter.updatedAt ?? study.frontmatter.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  // Only products with a rendered detail page. `hasDetail` is derived from the
  // published MDX collection, so a Planned product can never leak into the
  // sitemap as a URL that 404s.
  const products = getProducts()
    .filter((product) => product.hasDetail)
    .map((product) => ({
      url: new URL(`/products/${product.id}`, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Essays whose canonical URL points at Substack are deliberately omitted.
  // Listing a URL here asks a crawler to index it, while its rel="canonical"
  // asks the crawler to index Substack instead — two contradictory
  // instructions for the same page. The page stays reachable and crawlable;
  // it just stops nominating itself.
  const essays = getAllEssays()
    .filter((essay) => !essay.frontmatter.canonicalUrl)
    .map((essay) => ({
      url: new URL(`/writing/${essay.slug}`, SITE_URL).toString(),
      lastModified: contentDate(essay.frontmatter.updatedAt ?? essay.frontmatter.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...products, ...caseStudies, ...essays];
}
