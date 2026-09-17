// src/utils/assets.js
// All product / marketing images live in the public Supabase Storage bucket "Assets".
// Upload your local src/assets folder INTO that bucket, keeping the same folder names.
//
// Example local file:
//   src/assets/hero/NeverHero.png
// becomes:
//   Assets/hero/NeverHero.png
// URL:
//   https://slccifxxjgoaqpqabmbb.supabase.co/storage/v1/object/public/Assets/hero/NeverHero.png

export const ASSET_BASE =
  'https://slccifxxjgoaqpqabmbb.supabase.co/storage/v1/object/public/Assets';

/**
 * Build a public URL for a file inside the Assets bucket.
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
