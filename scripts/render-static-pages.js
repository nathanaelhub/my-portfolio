#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const GITHUB_BASE_URL = 'https://nathanaelhub.github.io/my-portfolio';

const routes = [
  { path: '/about', outDir: 'out/about', fileName: 'index.html' },
  { path: '/gallery', outDir: 'out/gallery', fileName: 'index.html' },
  { path: '/work', outDir: 'out/work', fileName: 'index.html' },
  { path: '/blog', outDir: 'out/blog', fileName: 'index.html' },
  { path: '/test-images', outDir: 'out/test-images', fileName: 'index.html' }
];

console.log('🎭 Starting brute-force static page rendering...');

async function renderStaticPages() {
  let browser;
  
  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1920, height: 1080 });
    
    for (const route of routes) {
      console.log(`📄 Rendering ${route.path}...`);
      
      try {
        // Navigate to the page
        const url = `${BASE_URL}${route.path}`;
        console.log(`   Navigating to: ${url}`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        
        // Wait for any lazy-loaded content
        await page.waitForTimeout(2000);
        
        // Get the full HTML content
        const html = await page.content();
        
        // Fix image URLs for GitHub Pages
        const fixedHtml = fixImageUrls(html);
        
        // Ensure output directory exists
        if (!fs.existsSync(route.outDir)) {
          fs.mkdirSync(route.outDir, { recursive: true });
        }
        
        // Write the HTML file
        const outputPath = path.join(route.outDir, route.fileName);
        fs.writeFileSync(outputPath, fixedHtml);
        
        const size = (fs.statSync(outputPath).size / 1024).toFixed(1);
        console.log(`   ✅ Saved to ${outputPath} (${size}KB)`);
        
        // Verify the content contains expected elements
        if (route.path === '/about' && !html.includes('Nathanael')) {
          console.log(`   ⚠️  Warning: /about page may not have rendered correctly`);
        }
        if (route.path === '/gallery' && !html.includes('gallery')) {
          console.log(`   ⚠️  Warning: /gallery page may not have rendered correctly`);
        }
        
      } catch (error) {
        console.error(`   ❌ Failed to render ${route.path}: ${error.message}`);
        
        // Create a fallback HTML file
        const fallbackHtml = createFallbackHtml(route.path);
        const outputPath = path.join(route.outDir, route.fileName);
        if (!fs.existsSync(route.outDir)) {
          fs.mkdirSync(route.outDir, { recursive: true });
        }
        fs.writeFileSync(outputPath, fallbackHtml);
        console.log(`   🔄 Created fallback for ${route.path}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Browser launch failed:', error.message);
    
    // Create fallback files for all routes
    console.log('🔄 Creating fallback files...');
    routes.forEach(route => {
      const fallbackHtml = createFallbackHtml(route.path);
      if (!fs.existsSync(route.outDir)) {
        fs.mkdirSync(route.outDir, { recursive: true });
      }
      const outputPath = path.join(route.outDir, route.fileName);
      fs.writeFileSync(outputPath, fallbackHtml);
      console.log(`   📄 Created fallback: ${outputPath}`);
    });
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function fixImageUrls(html) {
  // Replace all image src attributes to use GitHub Pages URLs
  return html
    .replace(/src="\/my-portfolio\/images\//g, `src="${GITHUB_BASE_URL}/images/`)
    .replace(/src="\/images\//g, `src="${GITHUB_BASE_URL}/images/`)
    .replace(/href="\/my-portfolio\//g, `href="${GITHUB_BASE_URL}/`)
    .replace(/href="\//g, `href="${GITHUB_BASE_URL}/`)
    // Fix any remaining relative URLs
    .replace(/url\(\/my-portfolio\//g, `url(${GITHUB_BASE_URL}/`)
    .replace(/url\(\//g, `url(${GITHUB_BASE_URL}/`);
}

function createFallbackHtml(routePath) {
  const title = routePath.substring(1) || 'Home';
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title.charAt(0).toUpperCase() + title.slice(1)} - Nathanael Johnson</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nathanael Johnson</h1>
        <p>Applied AI Graduate Student</p>
        <p>This page is loading...</p>
        <script>
            // Redirect to main portfolio if this fallback is shown
            setTimeout(() => {
                window.location.href = '${GITHUB_BASE_URL}/';
            }, 3000);
        </script>
    </div>
</body>
</html>`;
}

if (require.main === module) {
  renderStaticPages()
    .then(() => {
      console.log('🎉 Static page rendering complete!');
    })
    .catch(error => {
      console.error('💥 Static rendering failed:', error);
      process.exit(1);
    });
}

module.exports = { renderStaticPages };