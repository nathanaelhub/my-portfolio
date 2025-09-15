#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'out';
const REQUIRED_PAGES = [
  'index.html',
  'about/index.html',
  'gallery/index.html',
  'blog/index.html',
  'work/index.html',
  '404.html'
];

function validateBuild() {
  console.log('🔍 Validating Next.js static export...');
  
  // Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`❌ Build directory '${BUILD_DIR}' not found!`);
    process.exit(1);
  }
  
  // Check for required HTML files
  let missingFiles = [];
  let foundFiles = [];
  
  REQUIRED_PAGES.forEach(page => {
    const filePath = path.join(BUILD_DIR, page);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      foundFiles.push(`✅ ${page} (${Math.round(stats.size / 1024)}KB)`);
    } else {
      missingFiles.push(`❌ ${page}`);
    }
  });
  
  // List all HTML files in build
  console.log('\n📄 Generated HTML files:');
  foundFiles.forEach(file => console.log(file));
  
  // Report missing files
  if (missingFiles.length > 0) {
    console.log('\n⚠️  Missing required files:');
    missingFiles.forEach(file => console.log(file));
    
    // Try to find similar files
    console.log('\n📁 Available files in build directory:');
    const allFiles = getAllFiles(BUILD_DIR, '.html');
    allFiles.forEach(file => {
      const relativePath = path.relative(BUILD_DIR, file);
      const stats = fs.statSync(file);
      console.log(`   ${relativePath} (${Math.round(stats.size / 1024)}KB)`);
    });
    
    process.exit(1);
  }
  
  // Check for .nojekyll file
  const nojekyllPath = path.join(BUILD_DIR, '.nojekyll');
  if (fs.existsSync(nojekyllPath)) {
    console.log('✅ .nojekyll file found');
  } else {
    console.log('⚠️  .nojekyll file missing - adding it now');
    fs.writeFileSync(nojekyllPath, '');
  }
  
  // Validate image assets
  const imagesDir = path.join(BUILD_DIR, 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = getAllFiles(imagesDir, ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
    console.log(`✅ Found ${imageFiles.length} image assets`);
  } else {
    console.log('⚠️  Images directory not found');
  }
  
  // Check file sizes for potential issues
  const largeFiles = [];
  foundFiles.forEach(file => {
    const filename = file.split(' ')[1];
    const filePath = path.join(BUILD_DIR, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 1024 * 1024) { // > 1MB
        largeFiles.push(`${filename} (${Math.round(stats.size / (1024 * 1024))}MB)`);
      }
    }
  });
  
  if (largeFiles.length > 0) {
    console.log('\n📊 Large files detected:');
    largeFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\n✅ Build validation completed successfully!');
  console.log(`📦 Total build size: ${getBuildSize()}MB`);
}

function getAllFiles(dir, extensions) {
  let files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (stat.isFile()) {
      if (typeof extensions === 'string') {
        if (fullPath.endsWith(extensions)) {
          files.push(fullPath);
        }
      } else if (Array.isArray(extensions)) {
        if (extensions.some(ext => fullPath.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
  }
  
  return files;
}

function getBuildSize() {
  let totalSize = 0;
  
  function calculateSize(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        calculateSize(fullPath);
      } else {
        totalSize += stat.size;
      }
    }
  }
  
  calculateSize(BUILD_DIR);
  return Math.round(totalSize / (1024 * 1024));
}

// Run validation
validateBuild();