/**
 * One-time migration script: Sanity.io → Supabase
 *
 * Prerequisites:
 *   1. npm install @sanity/client @sanity/image-url (temporarily)
 *   2. Set env vars below or create a .env.migration file
 *   3. Supabase tables already created (run supabase-schema.sql first)
 *   4. Supabase Storage bucket "portfolio-images" already created
 *   5. You must use a Supabase SERVICE ROLE key (not anon) for this script
 *
 * Usage: node scripts/migrate-from-sanity.js
 */

import { createClient as createSanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ============================================
// Configuration — fill these in before running
// ============================================

// Read .env file manually (no dotenv dependency needed)
import { readFileSync } from 'fs';
const envFile = readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const [key, ...rest] = l.split('=');
    return [key.trim(), rest.join('=').trim()];
  })
);

const SANITY_PROJECT_ID = 'xib1jdtd';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = 'skb9UcfyN1qDukOjGaEVVVvfoR2rcRlxYX7on0DSuJkOXbdhlxfv0fmBOGqlZdDiRkd7f3MLBoLgvssZGudrjq3dhY4Yd1WTBeoD5nkPRguStz8KmtmGPeMbNdOgjNl1LSyUySrWvikr1ZhZ09ElSGO4UEDrWy9K4WJdlpwjz6F2SLj0p0wW';

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================

const sanity = createSanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2022-10-20',
  useCdn: false,
  token: SANITY_TOKEN,
});

const builder = imageUrlBuilder(sanity);
const urlFor = (source) => builder.image(source);

const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Temp directory for downloaded images
const TEMP_DIR = './scripts/temp-images';

async function downloadImage(imageRef, folder, name) {
  if (!imageRef) return null;

  try {
    const url = urlFor(imageRef).url();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Extract extension from URL or default to png
    const ext = url.match(/\.(png|jpg|jpeg|gif|webp|svg)/i)?.[1] || 'png';
    const filename = `${name}.${ext}`;
    const storagePath = `${folder}/${filename}`;

    // Save locally first
    const localDir = path.join(TEMP_DIR, folder);
    if (!existsSync(localDir)) await mkdir(localDir, { recursive: true });
    const localPath = path.join(localDir, filename);
    await writeFile(localPath, buffer);

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(storagePath, buffer, {
        contentType: `image/${ext === 'svg' ? 'svg+xml' : ext}`,
        upsert: true,
      });

    if (error) {
      console.error(`  ❌ Upload failed for ${storagePath}:`, error.message);
      return null;
    }

    console.log(`  ✅ Uploaded: ${storagePath}`);
    return storagePath;
  } catch (err) {
    console.error(`  ❌ Image download/upload failed:`, err.message);
    return null;
  }
}

async function migrateAbouts() {
  console.log('\n📦 Migrating Abouts...');
  const docs = await sanity.fetch('*[_type == "abouts"]');
  console.log(`  Found ${docs.length} abouts`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const imgPath = await downloadImage(doc.imgUrl, 'abouts', `about-${i}`);

    const { error } = await supabase.from('abouts').insert([{
      title: doc.title,
      description: doc.description,
      img_path: imgPath || '',
      sort_order: i,
    }]);

    if (error) console.error(`  ❌ Insert error:`, error.message);
    else console.log(`  ✅ Inserted: ${doc.title}`);
  }
}

async function migrateWorks() {
  console.log('\n📦 Migrating Works...');
  const docs = await sanity.fetch('*[_type == "works"]');
  console.log(`  Found ${docs.length} works`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const imgPath = await downloadImage(doc.imgUrl, 'works', `work-${i}`);

    const { error } = await supabase.from('works').insert([{
      title: doc.title,
      description: doc.description,
      project_link: doc.projectLink || null,
      code_link: doc.codeLink || null,
      img_path: imgPath || '',
      tags: doc.tags || [],
      sort_order: i,
    }]);

    if (error) console.error(`  ❌ Insert error:`, error.message);
    else console.log(`  ✅ Inserted: ${doc.title}`);
  }
}

async function migrateSkills() {
  console.log('\n📦 Migrating Skills...');
  const docs = await sanity.fetch('*[_type == "skills"]');
  console.log(`  Found ${docs.length} skills`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const iconPath = await downloadImage(doc.icon, 'skills', `skill-${i}-${doc.name?.toLowerCase().replace(/\s+/g, '-')}`);

    const { error } = await supabase.from('skills').insert([{
      name: doc.name,
      bg_color: doc.bgColor || '#edf2f8',
      icon_path: iconPath || '',
      sort_order: i,
    }]);

    if (error) console.error(`  ❌ Insert error:`, error.message);
    else console.log(`  ✅ Inserted: ${doc.name}`);
  }
}

async function migrateExperiences() {
  console.log('\n📦 Migrating Experiences...');
  const docs = await sanity.fetch('*[_type == "experiences"]');
  console.log(`  Found ${docs.length} experiences`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    // Insert experience (parent)
    const { data, error } = await supabase
      .from('experiences')
      .insert([{ year: doc.year, sort_order: i }])
      .select();

    if (error) {
      console.error(`  ❌ Insert error:`, error.message);
      continue;
    }

    const experienceId = data[0].id;
    console.log(`  ✅ Inserted experience: ${doc.year}`);

    // Insert work items (children)
    if (doc.works && doc.works.length > 0) {
      const workItems = doc.works.map((w, j) => ({
        experience_id: experienceId,
        name: w.name,
        company: w.company,
        desc: w.desc || null,
        sort_order: j,
      }));

      const { error: workError } = await supabase
        .from('experience_works')
        .insert(workItems);

      if (workError) console.error(`  ❌ Work items error:`, workError.message);
      else console.log(`    ✅ Inserted ${workItems.length} work items`);
    }
  }
}

async function migrateTestimonials() {
  console.log('\n📦 Migrating Testimonials...');
  const docs = await sanity.fetch('*[_type == "testimonials"]');
  console.log(`  Found ${docs.length} testimonials`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    // Note: Sanity schema uses imgurl (lowercase) for testimonials
    const imgPath = await downloadImage(doc.imgurl, 'testimonials', `testimonial-${i}`);

    const { error } = await supabase.from('testimonials').insert([{
      name: doc.name,
      company: doc.company,
      feedback: doc.feedback,
      img_path: imgPath || '',
      sort_order: i,
    }]);

    if (error) console.error(`  ❌ Insert error:`, error.message);
    else console.log(`  ✅ Inserted: ${doc.name}`);
  }
}

async function migrateBrands() {
  console.log('\n📦 Migrating Brands...');
  const docs = await sanity.fetch('*[_type == "brands"]');
  console.log(`  Found ${docs.length} brands`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const imgPath = await downloadImage(doc.imgUrl, 'brands', `brand-${i}-${doc.name?.toLowerCase().replace(/\s+/g, '-')}`);

    const { error } = await supabase.from('brands').insert([{
      name: doc.name || `Brand ${i + 1}`,
      img_path: imgPath || '',
      sort_order: i,
    }]);

    if (error) console.error(`  ❌ Insert error:`, error.message);
    else console.log(`  ✅ Inserted: ${doc.name || `Brand ${i + 1}`}`);
  }
}

async function main() {
  console.log('🚀 Starting Sanity → Supabase migration\n');
  console.log('='.repeat(50));

  // Create temp dir
  if (!existsSync(TEMP_DIR)) await mkdir(TEMP_DIR, { recursive: true });

  await migrateAbouts();
  await migrateWorks();
  await migrateSkills();
  await migrateExperiences();
  await migrateTestimonials();
  await migrateBrands();

  console.log('\n' + '='.repeat(50));
  console.log('✅ Migration complete!');
  console.log(`\nTemp images saved to: ${TEMP_DIR}`);
  console.log('You can safely delete the temp-images folder.');
  console.log('You can now uninstall @sanity/client and @sanity/image-url.');
}

main().catch(console.error);
