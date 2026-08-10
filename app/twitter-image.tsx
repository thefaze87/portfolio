/**
 * Twitter/X card image. Next resolves `twitter-image` separately from
 * `opengraph-image`, so this re-exports the OG card rather than maintaining a
 * second design. Both are 1200×630, which satisfies summary_large_image.
 */
export { alt, size, contentType, default } from './opengraph-image';
