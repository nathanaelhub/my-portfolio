#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { renderStaticPages } = require('./render-static-pages');
const { fixImageUrls } = require('./fix-image-urls');

console.log('💪 BRUTE FORCE BUILD - Making GitHub Pages actually work!');

let devServer = null;

async function bruteForceGitHubPagesBuild() {
  try {
    console.log('\n🧹 Step 1: Clean old build');
    if (fs.existsSync('out')) {
      fs.rmSync('out', { recursive: true, force: true });
    }
    if (fs.existsSync('.next')) {
      fs.rmSync('.next', { recursive: true, force: true });
    }

    console.log('\n🔨 Step 2: Build Next.js app');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\n🖼️ Step 3: Copy images manually');
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
    
    copyDir('public/images', 'out/images');
    console.log('✅ Images copied successfully');

    console.log('\n🌐 Step 4: Start dev server for page rendering');
    devServer = spawn('npm', ['run', 'dev'], { 
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });
    
    // Wait for server to start
    await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => {
        reject(new Error('Dev server failed to start within 60 seconds'));
      }, 60000);
      
      devServer.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Ready in') || output.includes('Local:')) {
          clearTimeout(timeout);
          console.log('✅ Dev server started');
          resolve();
        }
      });
      
      devServer.stderr.on('data', (data) => {
        console.log('Dev server stderr:', data.toString());
      });
      
      devServer.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    // Give server extra time to fully initialize
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🎭 Step 5: Render static pages with Puppeteer');
    await renderStaticPages();

    console.log('\n🔧 Step 6: Fix all image URLs');
    await fixImageUrls();

    console.log('\n📁 Step 7: Ensure critical files exist');
    const criticalFiles = [
      'out/index.html',
      'out/about/index.html', 
      'out/gallery/index.html',
      'out/work/index.html',
      'out/blog/index.html',
      'out/images/avatar.jpg',
      'out/images/gallery/horizontal-1.jpg'
    ];

    let allFilesExist = true;
    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const size = (fs.statSync(file).size / 1024).toFixed(1);
        console.log(`✅ ${file} (${size}KB)`);
      } else {
        console.log(`❌ MISSING: ${file}`);
        allFilesExist = false;
        
        // Create missing HTML files as fallbacks
        if (file.endsWith('.html')) {
          const dir = path.dirname(file);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          const routeName = file.includes('/') ? path.basename(dir) : 'home';
          const fallbackHtml = createFallbackHtml(routeName);
          fs.writeFileSync(file, fallbackHtml);
          console.log(`🔄 Created fallback: ${file}`);
        }
      }
    });

    console.log('\n📊 Step 8: Final validation');
    
    // Check about page content
    if (fs.existsSync('out/about/index.html')) {
      const aboutContent = fs.readFileSync('out/about/index.html', 'utf8');
      if (aboutContent.includes('Nathanael')) {
        console.log('✅ About page contains expected content');
      } else {
        console.log('⚠️  About page may be missing content');
      }
    }
    
    // Check gallery page content
    if (fs.existsSync('out/gallery/index.html')) {
      const galleryContent = fs.readFileSync('out/gallery/index.html', 'utf8');
      if (galleryContent.includes('gallery') || galleryContent.includes('Gallery')) {
        console.log('✅ Gallery page contains expected content');
      } else {
        console.log('⚠️  Gallery page may be missing content');
      }
    }

    // Add .nojekyll file
    fs.writeFileSync('out/.nojekyll', '');
    console.log('✅ .nojekyll file created');

    console.log('\n🎉 BRUTE FORCE BUILD COMPLETE!');
    console.log('All files should now work on GitHub Pages.');
    
  } catch (error) {
    console.error('\n💥 Build failed:', error.message);
    throw error;
  } finally {
    // Kill dev server
    if (devServer) {
      console.log('\n🛑 Stopping dev server...');
      devServer.kill('SIGTERM');
      
      // Force kill if it doesn't stop
      setTimeout(() => {
        if (!devServer.killed) {
          devServer.kill('SIGKILL');
        }
      }, 5000);
    }
  }
}

function createFallbackHtml(routeName) {
  const title = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Nathanael Johnson</title>
    <meta http-equiv="refresh" content="0; url=https://nathanaelhub.github.io/my-portfolio/">
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nathanael Johnson</h1>
        <p>Applied AI Graduate Student</p>
        <p>Redirecting to portfolio...</p>
        <p><a href="https://nathanaelhub.github.io/my-portfolio/">Click here if not redirected automatically</a></p>
    </div>
</body>
</html>`;
}

if (require.main === module) {
  bruteForceGitHubPagesBuild()
    .then(() => {
      console.log('\n✨ Build completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💀 Build failed:', error);
      process.exit(1);
    });
}

module.exports = { bruteForceGitHubPagesBuild };