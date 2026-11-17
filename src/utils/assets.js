// src/utils/assets.js
// All product / marketing images live in the public Cloudflare R2 bucket "scottyuzi-assets".
// Same folder layout as before (hero/, vests/, never2fly2praycolours/, etc.).
//
// Example:
//   hero/NeverHero.png
// URL:
//   https://pub-7436458f73a64f40894a5c6dc32e1456.r2.dev/hero/NeverHero.png

export const ASSET_BASE =
  import.meta.env.VITE_R2_PUBLIC_URL ||
  'https://pub-7436458f73a64f40894a5c6dc32e1456.r2.dev';

/**
 * Build a public URL for a file inside the R2 bucket.
 * @param {string} path - path relative to the bucket root, e.g. "hero/NeverHero.png"
 *                        or "new/SU Wing tshirt2.png" (spaces are fine — they get encoded)
 */
export function asset(path) {
  if (!path) return '';
  // strip leading slash and accidental "assets/" prefix
  const clean = String(path)
    .replace(/^\/+/, '')
    .replace(/^assets\//i, '');
  // encode each segment so spaces & special chars work in URLs
  const encoded = clean
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${ASSET_BASE}/${encoded}`;
}

export default asset;