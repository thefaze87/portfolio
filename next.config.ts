import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

export default nextConfig;
