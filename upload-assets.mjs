/**
 * upload-assets.mjs
 * Uploads every file under src/assets → Supabase Storage bucket "Assets"
 * keeping the SAME relative paths (so asset('hero/NeverHero.png') works).
 *
 * Usage (from your project root, where package.json lives):
 *
 *   1. npm install @supabase/supabase-js
 *   2. export SUPABASE_URL="https://slccifxxjgoaqpqabmbb.supabase.co"
 *   3. export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"   # Project Settings → API
 *   4. node upload-assets.mjs
 *
 * Optional:
 *   ASSETS_DIR=./src/assets  BUCKET=Assets  node upload-assets.mjs
 *
 * NEVER commit the service role key. It bypasses RLS.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://slccifxxjgoaqpqabmbb.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = process.env.BUCKET || 'Assets';
const ASSETS_DIR   = path.resolve(process.env.ASSETS_DIR || path.join(process.cwd(), 'src/assets'));

const IMAGE_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mov', '.avif',
]);

if (!SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Project Settings → API → service_role (secret)');
  console.error('   Then:  export SUPABASE_SERVICE_ROLE_KEY="eyJ..."');
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  console.error(`❌  Assets folder not found: ${ASSETS_DIR}`);
  console.error('   Run this from your project root, or set ASSETS_DIR=...');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function walk(dir, base = dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // skip .DS_Store etc.
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, base, list);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const relative = path.relative(base, full).split(path.sep).join('/'); // posix path in bucket
      list.push({ full, relative });
    }
  }
  return list;
}

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  const exists = (buckets || []).some((b) => b.name === BUCKET);
  if (exists) {
    console.log(`✓ Bucket "${BUCKET}" exists`);
    return;
  }
  console.log(`Creating public bucket "${BUCKET}"...`);
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 50 * 1024 * 1024,
  });
  if (createErr) throw createErr;
  console.log(`✓ Created bucket "${BUCKET}"`);
}

async function uploadOne({ full, relative }, retries = 2) {
  const body = fs.readFileSync(full);
  const contentType = guessType(full);

  const { error } = await supabase.storage.from(BUCKET).upload(relative, body, {
    contentType,
    upsert: true, // overwrite if already there — safe to re-run
    cacheControl: '31536000',
  });

  if (error) {
    if (retries > 0) {
      await sleep(800);
      return uploadOne({ full, relative }, retries - 1);
    }
    throw error;
  }
}

function guessType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avif': 'image/avif',
  };
  return map[ext] || 'application/octet-stream';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('── Supabase bulk upload ─────────────────────────');
  console.log(`URL:     ${SUPABASE_URL}`);
  console.log(`Bucket:  ${BUCKET}`);
  console.log(`Source:  ${ASSETS_DIR}`);
  console.log('────────────────────────────────────────────────\n');

  await ensureBucket();

  const files = walk(ASSETS_DIR);
  console.log(`Found ${files.length} media files\n`);

  if (files.length === 0) {
    console.error('Nothing to upload. Check ASSETS_DIR.');
    process.exit(1);
  }

  let ok = 0;
  let fail = 0;
  const failures = [];

  // modest concurrency so we don't hammer the API
  const CONCURRENCY = 4;
  let i = 0;

  async function worker() {
    while (i < files.length) {
      const idx = i++;
      const file = files[idx];
      const n = idx + 1;
      try {
        await uploadOne(file);
        ok++;
        console.log(`  [${n}/${files.length}] ✓ ${file.relative}`);
      } catch (err) {
        fail++;
        failures.push({ path: file.relative, message: err.message || String(err) });
        console.error(`  [${n}/${files.length}] ✗ ${file.relative} — ${err.message || err}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log('\n────────────────────────────────────────────────');
  console.log(`Done.  uploaded: ${ok}   failed: ${fail}`);
  if (failures.length) {
    console.log('\nFailed files:');
    failures.forEach((f) => console.log(`  - ${f.path}: ${f.message}`));
    process.exit(1);
  }

  console.log('\nTest one URL in the browser:');
  const sample = files[0].relative;
  const encoded = sample
    .split('/')
    .map((s) => encodeURIComponent(s))
    .join('/');
  console.log(`  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encoded}`);
  console.log('\nYou can re-run this script anytime — upsert overwrites safely.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
