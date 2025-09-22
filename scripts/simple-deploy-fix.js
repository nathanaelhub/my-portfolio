#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 SIMPLE DEPLOYMENT FIX');
console.log('========================');

const OUT_DIR = 'out';

function fixHtmlFiles() {
  console.log('\n📄 Fixing HTML files...');
  
  // Find all HTML files in out directory
  function findHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findHtmlFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const htmlFiles = findHtmlFiles(OUT_DIR);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  for (const file of htmlFiles) {
    console.log(`  🔧 Fixing: ${file}`);
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix any remaining double basePath issues
    const originalLength = content.length;
    content = content.replace(/\/my-portfolio\/my-portfolio\//g, '/my-portfolio/');
    
    if (content.length !== originalLength) {
      console.log(`    ✅ Fixed double basePath in ${file}`);
    }
    
    fs.writeFileSync(file, content);
  }
}

function ensureRouteFiles() {
  console.log('\n📁 Ensuring route files exist...');
  
  const routes = [
    { route: '/about', file: 'about/index.html' },
    { route: '/gallery', file: 'gallery/index.html' },
    { route: '/work', file: 'work/index.html' },
    { route: '/blog', file: 'blog/index.html' },
    { route: '/test', file: 'test/index.html' }
  ];
  
  for (const { route, file } of routes) {
    const filePath = path.join(OUT_DIR, file);
    
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${route} exists: ${file}`);
    } else {
      console.log(`  ❌ Missing: ${file}`);
      
      // Create directory if needed
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Create a simple redirect page
      const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=/my-portfolio/">
</head>
<body>
    <h1>Redirecting to Portfolio...</h1>
    <p><a href="/my-portfolio/">Click here if not redirected</a></p>
</body>
</html>`;
      
      fs.writeFileSync(filePath, redirectHtml);
      console.log(`  🔄 Created redirect for ${route}`);
    }
  }
}

function copyStaticAssets() {
  console.log('\n📁 Ensuring static assets...');
  
  // Ensure images directory exists
  const publicImages = 'public/images';
  const outImages = path.join(OUT_DIR, 'images');
  
  if (fs.existsSync(publicImages)) {
    if (!fs.existsSync(outImages)) {
      console.log('  📸 Copying images directory...');
      fs.cpSync(publicImages, outImages, { recursive: true });
    } else {
      console.log('  ✅ Images already exist');
    }
  }
  
  // Copy other static files
  const staticFiles = ['favicon.png', 'icon.png', 'robots.txt'];
  
  for (const file of staticFiles) {
    const publicFile = path.join('public', file);
    const outFile = path.join(OUT_DIR, file);
    
    if (fs.existsSync(publicFile) && !fs.existsSync(outFile)) {
      fs.copyFileSync(publicFile, outFile);
      console.log(`  ✅ Copied: ${file}`);
    }
  }
  
  // Ensure .nojekyll exists
  const nojekyll = path.join(OUT_DIR, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
    console.log('  ✅ Created .nojekyll');
  }
}

function validateDeployment() {
  console.log('\n🔍 Validating deployment...');
  
  const criticalFiles = [
    'index.html',
    'about/index.html',
    'gallery/index.html',
    'images/avatar.jpg',
    'images/gallery/horizontal-1.jpg'
  ];
  
  let allGood = true;
  
  for (const file of criticalFiles) {
    const filePath = path.join(OUT_DIR, file);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      console.log(`  ✅ ${file} (${(size/1024).toFixed(1)}KB)`);
    } else {
      console.log(`  ❌ MISSING: ${file}`);
      allGood = false;
    }
  }
  
  console.log(`\n📊 Deployment ${allGood ? '✅ READY' : '❌ HAS ISSUES'}`);
  
  // Show summary
  const totalFiles = fs.readdirSync(OUT_DIR, { recursive: true }).length;
  const htmlFiles = fs.readdirSync(OUT_DIR, { recursive: true }).filter(f => f.endsWith('.html')).length;
  console.log(`Total files: ${totalFiles}, HTML files: ${htmlFiles}`);
  
  return allGood;
}

// Run all fixes
try {
  fixHtmlFiles();
  ensureRouteFiles();
  copyStaticAssets();
  
  const success = validateDeployment();
  
  if (success) {
    console.log('\n🎉 Simple deployment fix completed successfully!');
    process.exit(0);
  } else {
    console.log('\n💥 Deployment validation failed!');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n💥 Error during deployment fix:', error);
  process.exit(1);
}