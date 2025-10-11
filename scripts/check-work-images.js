#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKING WORK/PROJECT IMAGES');
console.log('='.repeat(70));
console.log();

const WORK_DIR = 'src/app/work/projects';
const PUBLIC_DIR = 'public';

function imageExists(imagePath) {
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  return fs.existsSync(fullPath);
}

if (!fs.existsSync(WORK_DIR)) {
  console.log('❌ Work projects directory not found:', WORK_DIR);
  process.exit(1);
}

const projects = fs.readdirSync(WORK_DIR)
  .filter(f => f.endsWith('.mdx'))
  .sort();

console.log(`Found ${projects.length} project pages\n`);

let totalBroken = 0;
let totalWorking = 0;

projects.forEach(project => {
  const projectPath = path.join(WORK_DIR, project);
  const content = fs.readFileSync(projectPath, 'utf8');

  console.log(`📄 ${project}`);

  // Find all image references
  const mdImages = [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
  const srcImages = [...content.matchAll(/src=["']([^"']+\.(?:jpg|jpeg|png|gif|webp|svg))["']/gi)];

  const allImages = [
    ...mdImages.map(m => ({ path: m[1], type: 'markdown' })),
    ...srcImages.map(m => ({ path: m[1], type: 'src' }))
  ];

  if (allImages.length === 0) {
    console.log('  ℹ️  No images found\n');
    return;
  }

  allImages.forEach(img => {
    if (img.path.startsWith('http')) {
      console.log(`  🌐 ${img.path} (external)`);
    } else if (imageExists(img.path)) {
      console.log(`  ✅ ${img.path}`);
      totalWorking++;
    } else {
      console.log(`  ❌ ${img.path} → FILE NOT FOUND`);
      totalBroken++;
    }
  });

  console.log();
});

console.log('='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log();
console.log(`  Total projects scanned: ${projects.length}`);
console.log(`  Working image refs:     ${totalWorking}`);
console.log(`  Broken image refs:      ${totalBroken}`);
console.log();

if (totalBroken > 0) {
  console.log('⚠️  Some project images are missing');
  process.exit(1);
} else {
  console.log('✅ ALL PROJECT IMAGES ARE VALID');
  process.exit(0);
}
