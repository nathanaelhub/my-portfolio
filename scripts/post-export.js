#!/usr/bin/env node

/**
 * POST-EXPORT URL FIXER
 *
 * This script fixes ALL URLs in the exported HTML to work with GitHub Pages.
 * It's SIMPLE and GUARANTEED to work - no complex tools, just string replacement.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = 'out';
const BASE_PATH = '/my-portfolio';

console.log('🔧 POST-EXPORT URL FIXER');
console.log('=======================\n');

let fixCount = 0;
let fileCount = 0;

/**
 * Recursively find all HTML files
 */
function findHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && item !== '_next') {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Fix URLs in a single file
 */
function fixUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix patterns:
  // 1. src="/images/    ->  src="/my-portfolio/images/
  // 2. href="/images/   ->  href="/my-portfolio/images/
  // 3. srcset="/images/ ->  srcset="/my-portfolio/images/

  // BUT AVOID double basePath (/my-portfolio/my-portfolio/)

  // Fix src attributes for images
  content = content.replace(/src="\/images\//g, `src="${BASE_PATH}/images/`);

  // Fix href attributes for images
  content = content.replace(/href="\/images\//g, `href="${BASE_PATH}/images/`);

  // Fix srcset attributes
  content = content.replace(/srcset="\/images\//g, `srcset="${BASE_PATH}/images/`);

  // Fix CSS url() references
  content = content.replace(/url\(\/images\//g, `url(${BASE_PATH}/images/`);

  // Fix meta tags with images
  content = content.replace(/content="\/images\//g, `content="${BASE_PATH}/images/`);

  // Fix any double basePath that might have been created
  content = content.replace(/\/my-portfolio\/my-portfolio\//g, '/my-portfolio/');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    return true;
  }

  return false;
}

/**
 * Ensure directory structure exists
 */
function ensureRoutes() {
  console.log('📁 Ensuring route directories...');

  const routes = ['about', 'gallery', 'work', 'blog', 'test'];

  for (const route of routes) {
    const dir = path.join(OUT_DIR, route);
    const indexPath = path.join(dir, 'index.html');
    const htmlPath = path.join(OUT_DIR, `${route}.html`);

    // If we have route.html but not route/index.html, copy it
    if (fs.existsSync(htmlPath) && !fs.existsSync(indexPath)) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(htmlPath, indexPath);
      console.log(`  ✅ Created ${route}/index.html from ${route}.html`);
    } else if (fs.existsSync(indexPath)) {
      console.log(`  ✅ ${route}/index.html exists`);
    }
  }
}

/**
 * Copy images if needed
 */
function ensureImages() {
  console.log('\n🖼️  Ensuring images directory...');

  const publicImages = path.join('public', 'images');
  const outImages = path.join(OUT_DIR, 'images');

  if (!fs.existsSync(outImages) && fs.existsSync(publicImages)) {
    fs.cpSync(publicImages, outImages, { recursive: true });
    console.log('  ✅ Copied images from public/');
  } else {
    console.log('  ✅ Images already exist');
  }

  // Ensure .nojekyll
  const nojekyll = path.join(OUT_DIR, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
    console.log('  ✅ Created .nojekyll');
  }
}

/**
 * Validate deployment
 */
function validate() {
  console.log('\n✅ VALIDATION');
  console.log('=============');

  const criticalFiles = [
    'index.html',
    'about/index.html',
    'images/avatar.jpg'
  ];

  let allGood = true;

  for (const file of criticalFiles) {
    const filePath = path.join(OUT_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ MISSING: ${file}`);
      allGood = false;
    }
  }

  // Check if URLs are fixed in index.html
  const indexPath = path.join(OUT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');

    // Check for WRONG URLs (without basePath)
    const wrongImageUrls = content.match(/src="\/images\//g) || [];
    const wrongHrefUrls = content.match(/href="\/images\//g) || [];

    // Check for CORRECT URLs (with basePath)
    const correctImageUrls = content.match(/src="\/my-portfolio\/images\//g) || [];
    const correctMetaUrls = content.match(/content="https:\/\/nathanaelhub\.github\.io\/my-portfolio\/images\//g) || [];

    console.log(`\n📊 URL CHECK (index.html):`);
    console.log(`  ❌ Wrong image URLs (src="/images/): ${wrongImageUrls.length}`);
    console.log(`  ❌ Wrong href URLs (href="/images/): ${wrongHrefUrls.length}`);
    console.log(`  ✅ Correct image URLs: ${correctImageUrls.length}`);
    console.log(`  ✅ Correct meta URLs: ${correctMetaUrls.length}`);

    if (wrongImageUrls.length > 0 || wrongHrefUrls.length > 0) {
      console.log(`\n⚠️  WARNING: Found URLs without basePath! These will break!`);
      allGood = false;
    }
  }

  return allGood;
}

// RUN THE FIXES
try {
  console.log('🔍 Finding HTML files...');
  const htmlFiles = findHtmlFiles(OUT_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  console.log('🔧 Fixing URLs...');
  for (const file of htmlFiles) {
    if (fixUrlsInFile(file)) {
      fixCount++;
      const relativePath = file.replace(OUT_DIR + '/', '');
      console.log(`  ✅ Fixed: ${relativePath}`);
    }
    fileCount++;
  }

  console.log(`\n📊 Fixed ${fixCount} out of ${fileCount} files\n`);

  ensureRoutes();
  ensureImages();

  const isValid = validate();

  if (isValid) {
    console.log('\n🎉 POST-EXPORT FIX COMPLETE!\n');
    console.log('Deployment is ready for GitHub Pages.');
    process.exit(0);
  } else {
    console.log('\n💥 VALIDATION FAILED!\n');
    console.log('Some issues need to be fixed before deploying.');
    process.exit(1);
  }

} catch (error) {
  console.error('\n💥 ERROR:', error.message);
  process.exit(1);
}