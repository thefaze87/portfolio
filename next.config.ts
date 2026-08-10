import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /**
   * Pin Turbopack's workspace root to this package. A pnpm-lock.yaml in the
   * home directory otherwise wins, and relative CSS imports like
   * `../styles/tokens.css` resolve outside the project.
   */
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    /**
     * Prefer AVIF for transparent-background photos. Next/Sharp's default
     * WebP output uses lossy VP8 which strips the alpha channel — that
     * baked the cutout portrait's transparent background into solid white
     * before this was set. AVIF (and VP8L/VP8X WebP as fallback) preserves
     * alpha at lossy quality with a much smaller file than the
     * unoptimized PNG, restoring the perf budget without losing the
     * cutout silhouette.
     */
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * The case-study section was renamed /work → /projects when Projects became
   * a first-class nav member alongside Experience. Permanent redirects keep
   * any already-shared link alive and pass the ranking signal through rather
   * than stranding it on a 404.
   */
  async redirects() {
    /**
     * ORDER IS LOAD-BEARING. Next matches the first rule that fits, so every
     * specific rule must precede the `/work/:slug` wildcard. Listing the
     * wildcard first sent /work/helixon to /projects/helixon, which then
     * redirected again to /products/helixon — a two-hop chain that wastes a
     * round trip and dilutes the ranking signal a 301 is meant to pass on.
     *
     * Two migrations are encoded here:
     *   1. /work → /projects (section rename)
     *   2. /projects/<venture> → /products/<venture> (ownership split:
     *      Projects is work Mark was hired for, Products is what he owns)
     *
     * The `/work/<venture>` entries collapse both hops into one.
     */
    const OWNED_VENTURES = ['helixon', 'opsly', 'clue-finder-tours', 'trustlaunch'];

    return [
      // Specific first — both legacy prefixes land directly on /products.
      ...OWNED_VENTURES.flatMap((slug) => [
        { source: `/projects/${slug}`, destination: `/products/${slug}`, permanent: true },
        { source: `/work/${slug}`, destination: `/products/${slug}`, permanent: true },
      ]),

      // Wildcards last. /projects/:slug is deliberately NOT redirected — the
      // case studies that legitimately remain there must keep resolving.
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/work/:slug', destination: '/projects/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
