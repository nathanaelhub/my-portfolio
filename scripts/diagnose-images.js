#!/usr/bin/env node

/**
 * IMAGE DIAGNOSTIC SCRIPT
 *
 * Checks what images are expected vs what actually exists
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 IMAGE DIAGNOSTIC REPORT');
console.log('=========================\n');

// Helper to recursively find all image files
function findImages(dir, baseDir = dir) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findImages(fullPath, baseDir));
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item)) {
      const relativePath = path.relative(baseDir, fullPath);
      results.push({
        path: relativePath,
        fullPath: fullPath,
        name: item,
        size: stat.size
      });
    }
  }

  return results;
}

// 1. LIST ALL GALLERY IMAGES
console.log('📁 GALLERY IMAGES IN public/images/gallery/');
console.log('==========================================');

const galleryDir = path.join('public', 'images', 'gallery');
const galleryImages = findImages(galleryDir, galleryDir);

if (galleryImages.length === 0) {
  console.log('  ❌ No images found in public/images/gallery/');
} else {
  galleryImages.sort((a, b) => a.name.localeCompare(b.name));
  galleryImages.forEach(img => {
    const sizeKB = (img.size / 1024).toFixed(1);
    console.log(`  ✅ ${img.name} (${sizeKB} KB)`);
  });
  console.log(`\n  Total: ${galleryImages.length} images`);
}

// 2. CHECK CONTENT.TSX GALLERY CONFIGURATION
console.log('\n📝 GALLERY IMAGES IN src/resources/content.tsx');
console.log('==============================================');

const contentPath = path.join('src', 'resources', 'content.tsx');
let expectedGalleryImages = [];

if (fs.existsSync(contentPath)) {
  const content = fs.readFileSync(contentPath, 'utf8');

  // Extract gallery images - look for all getImagePath() calls in gallery section
  const galleryStart = content.indexOf('const gallery: Gallery = {');
  const galleryEnd = content.indexOf('};', galleryStart);

  if (galleryStart !== -1 && galleryEnd !== -1) {
    const gallerySection = content.substring(galleryStart, galleryEnd);

    // Match getImagePath() calls
    const getImagePathMatches = gallerySection.matchAll(/getImagePath\(["']([^"']+)["']\)/g);

    for (const match of getImagePathMatches) {
      expectedGalleryImages.push(match[1]);
    }

    console.log(`  Found ${expectedGalleryImages.length} images referenced in content.tsx:`);
    expectedGalleryImages.forEach(img => {
      console.log(`    - ${img}`);
    });
  } else {
    console.log('  ⚠️  Could not parse gallery.images array');
  }
} else {
  console.log('  ❌ content.tsx not found');
}

// 3. COMPARE EXPECTED VS ACTUAL GALLERY IMAGES
console.log('\n🔎 GALLERY IMAGE COMPARISON');
console.log('===========================');

const actualGalleryPaths = galleryImages.map(img => `/images/gallery/${img.name}`);

// Missing images (expected but not found)
const missingGallery = expectedGalleryImages.filter(expected => {
  return !actualGalleryPaths.includes(expected);
});

// Unused images (present but not referenced)
const unusedGallery = galleryImages.filter(img => {
  const imgPath = `/images/gallery/${img.name}`;
  return !expectedGalleryImages.includes(imgPath);
});

if (missingGallery.length === 0 && unusedGallery.length === 0) {
  console.log('  ✅ All gallery images match perfectly!');
} else {
  if (missingGallery.length > 0) {
    console.log(`\n  ❌ MISSING (${missingGallery.length} images referenced but not found):`);
    missingGallery.forEach(img => {
      console.log(`    - ${img}`);
    });
  }

  if (unusedGallery.length > 0) {
    console.log(`\n  ⚠️  UNUSED (${unusedGallery.length} images present but not referenced):`);
    unusedGallery.forEach(img => {
      console.log(`    - /images/gallery/${img.name}`);
    });
  }
}

// 4. CHECK BLOG POST IMAGES
console.log('\n📰 BLOG POST IMAGE REFERENCES');
console.log('=============================');

const blogDir = path.join('src', 'app', 'blog', 'posts');
let blogImageRefs = [];

if (fs.existsSync(blogDir)) {
  const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

  console.log(`  Found ${posts.length} blog posts\n`);

  posts.forEach(post => {
    const postPath = path.join(blogDir, post);
    const content = fs.readFileSync(postPath, 'utf8');

    // Find image references in MDX
    const imgMatches = content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
    const srcMatches = content.matchAll(/src=["']([^"']+\.(?:jpg|jpeg|png|gif|webp|svg))["']/gi);

    const postImages = [];

    for (const match of imgMatches) {
      const imgPath = match[2];
      if (imgPath.startsWith('/images/')) {
        postImages.push(imgPath);
        blogImageRefs.push({ post, image: imgPath });
      }
    }

    for (const match of srcMatches) {
      const imgPath = match[1];
      if (imgPath.startsWith('/images/')) {
        postImages.push(imgPath);
        blogImageRefs.push({ post, image: imgPath });
      }
    }

    if (postImages.length > 0) {
      console.log(`  📄 ${post}:`);
      postImages.forEach(img => console.log(`    - ${img}`));
    }
  });

  if (blogImageRefs.length === 0) {
    console.log('  ℹ️  No image references found in blog posts');
  }
} else {
  console.log('  ⚠️  Blog posts directory not found');
}

// 5. VERIFY BLOG IMAGE FILES EXIST
let foundCount = 0;
let missingCount = 0;

if (blogImageRefs.length > 0) {
  console.log('\n🔍 BLOG IMAGE VERIFICATION');
  console.log('==========================');

  const uniqueBlogImages = [...new Set(blogImageRefs.map(r => r.image))];
  const publicDir = 'public';

  uniqueBlogImages.forEach(imgPath => {
    // Remove leading slash
    const relativePath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    const fullPath = path.join(publicDir, relativePath);

    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const sizeKB = (stat.size / 1024).toFixed(1);
      console.log(`  ✅ ${imgPath} (${sizeKB} KB)`);
      foundCount++;
    } else {
      console.log(`  ❌ MISSING: ${imgPath}`);
      missingCount++;
    }
  });

  console.log(`\n  Summary: ${foundCount} found, ${missingCount} missing`);
}

// 6. CHECK ALL IMAGES IN PUBLIC/IMAGES
console.log('\n📊 ALL IMAGES IN public/images/');
console.log('================================');

const publicImagesDir = path.join('public', 'images');
const allPublicImages = findImages(publicImagesDir, publicImagesDir);

// Group by directory
const imagesByDir = {};
allPublicImages.forEach(img => {
  const dir = path.dirname(img.path);
  if (!imagesByDir[dir]) {
    imagesByDir[dir] = [];
  }
  imagesByDir[dir].push(img);
});

Object.keys(imagesByDir).sort().forEach(dir => {
  const images = imagesByDir[dir];
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const totalMB = (totalSize / 1024 / 1024).toFixed(2);

  console.log(`\n  📁 ${dir}/ (${images.length} images, ${totalMB} MB)`);
  images.forEach(img => {
    const sizeKB = (img.size / 1024).toFixed(1);
    console.log(`    - ${img.name} (${sizeKB} KB)`);
  });
});

const totalSize = allPublicImages.reduce((sum, img) => sum + img.size, 0);
const totalMB = (totalSize / 1024 / 1024).toFixed(2);
console.log(`\n  Total: ${allPublicImages.length} images, ${totalMB} MB`);

// 7. SUMMARY REPORT
console.log('\n' + '='.repeat(60));
console.log('📋 SUMMARY REPORT');
console.log('='.repeat(60));

console.log(`\n Gallery Images:`);
console.log(`   - Expected: ${expectedGalleryImages.length}`);
console.log(`   - Found: ${galleryImages.length}`);
console.log(`   - Missing: ${missingGallery.length}`);
console.log(`   - Unused: ${unusedGallery.length}`);

console.log(`\n Blog Images:`);
console.log(`   - References: ${blogImageRefs.length}`);
console.log(`   - Unique: ${blogImageRefs.length > 0 ? new Set(blogImageRefs.map(r => r.image)).size : 0}`);

console.log(`\n Total Public Images: ${allPublicImages.length}`);

// Check if there are any issues
const hasIssues = missingGallery.length > 0 || (blogImageRefs.length > 0 && missingCount > 0);

if (hasIssues) {
  console.log('\n⚠️  ISSUES DETECTED - See details above');
  process.exit(1);
} else {
  console.log('\n✅ NO ISSUES DETECTED');
  process.exit(0);
}