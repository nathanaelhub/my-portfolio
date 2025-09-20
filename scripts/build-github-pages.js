#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for GitHub Pages...');

// Step 1: Clean old build
console.log('🧹 Cleaning old build...');
if (fs.existsSync('out')) {
  fs.rmSync('out', { recursive: true, force: true });
}
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}

// Step 2: Run Next.js build
console.log('🔨 Running Next.js build...');
execSync('npm run build', { stdio: 'inherit' });

// Step 3: Export is now handled by output: "export" in next.config.mjs
console.log('📦 Static export generated automatically with build...');

// Step 4: Manually copy images to ensure they're in the right place
console.log('🖼️ Copying images...');
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping...`);
    return;
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Copy public/images to out/images
copyDir('public/images', 'out/images');

// Step 5: Ensure index.html files exist for all routes
console.log('🔧 Creating index.html files for routes...');
const createIndexHtml = (routePath, htmlContent) => {
  const dirPath = path.join('out', routePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const indexPath = path.join(dirPath, 'index.html');
  if (!fs.existsSync(indexPath) && htmlContent) {
    fs.writeFileSync(indexPath, htmlContent);
  }
};

// Check if about and gallery HTML exist, if not copy from root
const routes = ['about', 'gallery', 'work', 'blog'];
routes.forEach(route => {
  const routeHtmlPath = path.join('out', route, 'index.html');
  if (!fs.existsSync(routeHtmlPath)) {
    // Try to find the HTML file in the route's directory or copy from root
    const routeDir = path.join('out', route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    // Copy the main index.html as fallback
    const mainIndexPath = path.join('out', 'index.html');
    if (fs.existsSync(mainIndexPath)) {
      console.log(`📄 Creating ${route}/index.html from main index.html`);
      fs.copyFileSync(mainIndexPath, routeHtmlPath);
    }
  }
});

// Step 6: List all files for debugging
console.log('📋 Listing build output...');
const listFiles = (dir, indent = '') => {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${item}/`);
      if (indent.length < 8) { // Limit recursion depth
        listFiles(itemPath, indent + '  ');
      }
    } else {
      const size = (stats.size / 1024).toFixed(1);
      console.log(`${indent}📄 ${item} (${size}KB)`);
    }
  });
};

listFiles('out');

// Step 7: Verify critical files exist
console.log('✅ Verifying critical files...');
const criticalFiles = [
  'out/index.html',
  'out/about/index.html',
  'out/gallery/index.html',
  'out/images/avatar.jpg',
  'out/images/gallery/horizontal-1.jpg'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} MISSING!`);
  }
});

console.log('🎉 GitHub Pages build complete!');