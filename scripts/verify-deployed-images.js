#!/usr/bin/env node

/**
 * VERIFY DEPLOYED IMAGES
 *
 * Checks if images are actually deployed and accessible on GitHub Pages
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nathanaelhub.github.io/my-portfolio';
const GALLERY_PATH = '/images/gallery/';

console.log('🔍 VERIFYING DEPLOYED IMAGES ON GITHUB PAGES');
console.log('='.repeat(60));
console.log(`\nBase URL: ${BASE_URL}`);
console.log(`Checking: ${BASE_URL}${GALLERY_PATH}\n`);

// Function to check if URL exists
function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'] || '';
      const contentLength = res.headers['content-length'] || '0';

      resolve({
        url,
        statusCode,
        contentType,
        contentLength: parseInt(contentLength),
        exists: statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        statusCode: 0,
        contentType: '',
        contentLength: 0,
        exists: false,
        error: err.message
      });
    });
  });
}

// Get local gallery images
function getLocalGalleryImages() {
  const galleryDir = path.join('public', 'images', 'gallery');

  if (!fs.existsSync(galleryDir)) {
    console.log('❌ Local gallery directory not found:', galleryDir);
    return [];
  }

  const files = fs.readdirSync(galleryDir)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .map(f => {
      const stat = fs.statSync(path.join(galleryDir, f));
      return {
        name: f,
        size: stat.size,
        path: `${GALLERY_PATH}${f}`
      };
    });

  return files;
}

// Get expected images from content.tsx
function getExpectedGalleryImages() {
  const contentPath = path.join('src', 'resources', 'content.tsx');

  if (!fs.existsSync(contentPath)) {
    console.log('⚠️  content.tsx not found');
    return [];
  }

  const content = fs.readFileSync(contentPath, 'utf8');
  const galleryStart = content.indexOf('const gallery: Gallery = {');
  const galleryEnd = content.indexOf('};', galleryStart);

  if (galleryStart === -1 || galleryEnd === -1) {
    console.log('⚠️  Could not parse gallery section');
    return [];
  }

  const gallerySection = content.substring(galleryStart, galleryEnd);
  const matches = gallerySection.matchAll(/getImagePath\(["']([^"']+)["']\)/g);

  const images = [];
  for (const match of matches) {
    images.push(match[1]);
  }

  return images;
}

async function main() {
  // 1. Get local images
  console.log('📁 LOCAL GALLERY IMAGES');
  console.log('-'.repeat(60));

  const localImages = getLocalGalleryImages();

  if (localImages.length === 0) {
    console.log('  ❌ No images found locally\n');
    return;
  }

  localImages.forEach(img => {
    const sizeKB = (img.size / 1024).toFixed(1);
    console.log(`  ✅ ${img.name.padEnd(25)} ${sizeKB.padStart(7)} KB`);
  });
  console.log(`\n  Total: ${localImages.length} images\n`);

  // 2. Get expected images from content.tsx
  console.log('📝 EXPECTED IMAGES FROM content.tsx');
  console.log('-'.repeat(60));

  const expectedImages = getExpectedGalleryImages();

  if (expectedImages.length === 0) {
    console.log('  ⚠️  No images found in content.tsx\n');
  } else {
    expectedImages.forEach(img => {
      console.log(`  📝 ${img}`);
    });
    console.log(`\n  Total: ${expectedImages.length} images\n`);
  }

  // 3. Check deployed images
  console.log('🌐 CHECKING DEPLOYED IMAGES ON GITHUB PAGES');
  console.log('-'.repeat(60));

  const checks = await Promise.all(
    localImages.map(img => checkUrl(`${BASE_URL}${img.path}`))
  );

  let successCount = 0;
  let failCount = 0;

  checks.forEach((check, i) => {
    const localImg = localImages[i];
    const localSizeKB = (localImg.size / 1024).toFixed(1);
    const deployedSizeKB = (check.contentLength / 1024).toFixed(1);

    if (check.exists) {
      const sizeMatch = Math.abs(localImg.size - check.contentLength) < 100;
      const statusIcon = sizeMatch ? '✅' : '⚠️ ';

      console.log(`  ${statusIcon} ${localImg.name.padEnd(25)} HTTP ${check.statusCode}`);
      console.log(`     Local: ${localSizeKB.padStart(7)} KB | Deployed: ${deployedSizeKB.padStart(7)} KB`);

      if (!sizeMatch) {
        console.log(`     ⚠️  Size mismatch!`);
      }

      successCount++;
    } else {
      console.log(`  ❌ ${localImg.name.padEnd(25)} HTTP ${check.statusCode || 'ERROR'}`);
      if (check.error) {
        console.log(`     Error: ${check.error}`);
      }
      failCount++;
    }
  });

  console.log(`\n  Results: ${successCount} accessible, ${failCount} missing\n`);

  // 4. Check for extra deployed images not in local
  console.log('🔍 CHECKING FOR DISCREPANCIES');
  console.log('-'.repeat(60));

  const localNames = localImages.map(img => img.name);
  const expectedPaths = expectedImages.map(p => path.basename(p));

  // Check for local images not in content.tsx
  const notInContent = localNames.filter(name => !expectedPaths.includes(name));
  if (notInContent.length > 0) {
    console.log('\n  ⚠️  Images in local folder but NOT in content.tsx:');
    notInContent.forEach(name => console.log(`     - ${name}`));
  }

  // Check for content.tsx images not in local folder
  const notInLocal = expectedPaths.filter(name => !localNames.includes(name));
  if (notInLocal.length > 0) {
    console.log('\n  ❌ Images in content.tsx but NOT in local folder:');
    notInLocal.forEach(name => console.log(`     - ${name}`));
  }

  if (notInContent.length === 0 && notInLocal.length === 0) {
    console.log('  ✅ All images match between local folder and content.tsx');
  }

  // 5. Test specific critical images
  console.log('\n\n🎯 TESTING CRITICAL GALLERY IMAGES');
  console.log('-'.repeat(60));

  const criticalImages = [
    'horizontal-1.jpg',
    'vertical-1.jpg',
    'horizontal-2.jpg',
    'vertical-2.jpg'
  ];

  for (const imgName of criticalImages) {
    const url = `${BASE_URL}${GALLERY_PATH}${imgName}`;
    const result = await checkUrl(url);

    if (result.exists) {
      const sizeKB = (result.contentLength / 1024).toFixed(1);
      console.log(`  ✅ ${imgName.padEnd(20)} → ${result.statusCode} (${sizeKB} KB)`);
    } else {
      console.log(`  ❌ ${imgName.padEnd(20)} → ${result.statusCode || 'FAILED'}`);
    }
  }

  // 6. Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n  Local images:      ${localImages.length}`);
  console.log(`  Expected in code:  ${expectedImages.length}`);
  console.log(`  Accessible online: ${successCount}`);
  console.log(`  Missing online:    ${failCount}`);

  if (failCount === 0 && successCount === localImages.length) {
    console.log('\n  ✅ ALL GALLERY IMAGES ARE DEPLOYED AND ACCESSIBLE!\n');
    process.exit(0);
  } else {
    console.log('\n  ⚠️  SOME IMAGES ARE MISSING OR INACCESSIBLE!\n');
    console.log('  Possible causes:');
    console.log('    1. Images not copied during build');
    console.log('    2. Post-export script not running');
    console.log('    3. GitHub Pages deployment incomplete');
    console.log('    4. File name case sensitivity issues\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n💥 ERROR:', err.message);
  process.exit(1);
});