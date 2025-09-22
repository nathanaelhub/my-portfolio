#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SITE_URL = 'https://nathanaelhub.github.io/my-portfolio';

console.log('🔍 ANALYZING REAL GITHUB PAGES DEPLOYMENT');
console.log('================================================');

async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function checkUrl(url) {
  try {
    await downloadFile(url);
    return { status: 'OK', code: 200 };
  } catch (error) {
    return { status: 'FAILED', error: error.message };
  }
}

async function analyzeDeployment() {
  const results = {
    pages: {},
    images: {},
    comparison: {}
  };
  
  const routes = ['/', '/about', '/gallery', '/work', '/blog', '/test-images'];
  
  console.log('\n📄 DOWNLOADING PAGES FROM GITHUB PAGES:');
  console.log('==========================================');
  
  for (const route of routes) {
    const routeName = route === '/' ? 'index' : route.substring(1);
    const url = `${SITE_URL}${route}`;
    
    console.log(`\n🌐 Checking: ${url}`);
    
    try {
      const html = await downloadFile(url);
      
      results.pages[routeName] = {
        url,
        status: 'SUCCESS',
        size: html.length,
        hasContent: true,
        content: html
      };
      
      // Check for expected content
      if (route === '/about') {
        const hasNathanael = html.includes('Nathanael');
        const hasAbout = html.includes('About');
        console.log(`   📝 Content check: Nathanael=${hasNathanael}, About=${hasAbout}`);
        results.pages[routeName].hasExpectedContent = hasNathanael;
      }
      
      if (route === '/gallery') {
        const hasGallery = html.toLowerCase().includes('gallery');
        const hasImages = html.includes('img src=') || html.includes('images/gallery');
        console.log(`   📝 Content check: Gallery=${hasGallery}, Images=${hasImages}`);
        results.pages[routeName].hasExpectedContent = hasGallery;
      }
      
      // Extract image URLs
      const imageUrls = [];
      const imgMatches = html.match(/src="[^"]*"/g) || [];
      imgMatches.forEach(match => {
        const src = match.substring(5, match.length - 1); // Remove src=" and "
        if (src.includes('images/') || src.includes('.jpg') || src.includes('.png')) {
          imageUrls.push(src);
        }
      });
      
      results.pages[routeName].imageUrls = imageUrls;
      console.log(`   🖼️  Found ${imageUrls.length} image URLs`);
      
      const size = (html.length / 1024).toFixed(1);
      console.log(`   ✅ Downloaded: ${size}KB`);
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.pages[routeName] = {
        url,
        status: 'FAILED',
        error: error.message
      };
    }
  }
  
  console.log('\n🖼️  TESTING IMAGE ACCESSIBILITY:');
  console.log('===============================');
  
  // Collect all unique image URLs
  const allImageUrls = new Set();
  Object.values(results.pages).forEach(page => {
    if (page.imageUrls) {
      page.imageUrls.forEach(url => allImageUrls.add(url));
    }
  });
  
  for (const imageUrl of allImageUrls) {
    let fullUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      fullUrl = `${SITE_URL}${imageUrl}`;
    }
    
    console.log(`\n🔗 Testing: ${fullUrl}`);
    const result = await checkUrl(fullUrl);
    
    results.images[imageUrl] = result;
    
    if (result.status === 'OK') {
      console.log(`   ✅ Accessible`);
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
    }
  }
  
  console.log('\n📊 COMPARING WITH LOCAL BUILD:');
  console.log('==============================');
  
  // Compare with local out directory
  for (const route of routes) {
    const routeName = route === '/' ? 'index' : route.substring(1);
    
    let localPath;
    if (route === '/') {
      localPath = 'out/index.html';
    } else {
      localPath = `out${route}/index.html`;
    }
    
    console.log(`\n📁 Comparing ${routeName}:`);
    
    if (fs.existsSync(localPath)) {
      const localHtml = fs.readFileSync(localPath, 'utf8');
      const remoteHtml = results.pages[routeName]?.content || '';
      
      const localSize = (localHtml.length / 1024).toFixed(1);
      const remoteSize = (remoteHtml.length / 1024).toFixed(1);
      
      console.log(`   📏 Local: ${localSize}KB, Remote: ${remoteSize}KB`);
      
      // Check if content matches
      const contentMatch = localHtml === remoteHtml;
      const sizeMatch = Math.abs(localHtml.length - remoteHtml.length) < 1000;
      
      console.log(`   🔍 Content identical: ${contentMatch}`);
      console.log(`   📐 Size similar: ${sizeMatch}`);
      
      // Check image paths difference
      const localImages = (localHtml.match(/src="[^"]*"/g) || []).length;
      const remoteImages = (remoteHtml.match(/src="[^"]*"/g) || []).length;
      
      console.log(`   🖼️  Images - Local: ${localImages}, Remote: ${remoteImages}`);
      
      results.comparison[routeName] = {
        localExists: true,
        localSize: localHtml.length,
        remoteSize: remoteHtml.length,
        contentMatch,
        sizeMatch,
        localImages,
        remoteImages
      };
      
    } else {
      console.log(`   ❌ Local file does not exist: ${localPath}`);
      results.comparison[routeName] = {
        localExists: false
      };
    }
  }
  
  console.log('\n🎯 SUMMARY ANALYSIS:');
  console.log('====================');
  
  const workingPages = Object.values(results.pages).filter(p => p.status === 'SUCCESS').length;
  const totalPages = Object.keys(results.pages).length;
  
  console.log(`📄 Working pages: ${workingPages}/${totalPages}`);
  
  const workingImages = Object.values(results.images).filter(i => i.status === 'OK').length;
  const totalImages = Object.keys(results.images).length;
  
  console.log(`🖼️  Working images: ${workingImages}/${totalImages}`);
  
  // Check critical pages
  const aboutWorks = results.pages.about?.status === 'SUCCESS' && results.pages.about?.hasExpectedContent;
  const galleryWorks = results.pages.gallery?.status === 'SUCCESS' && results.pages.gallery?.hasExpectedContent;
  
  console.log(`✅ About page working: ${aboutWorks}`);
  console.log(`✅ Gallery page working: ${galleryWorks}`);
  
  if (totalImages === 0) {
    console.log(`⚠️  NO IMAGES FOUND in deployed HTML!`);
  }
  
  // Save detailed results
  fs.writeFileSync('deployment-analysis.json', JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed results saved to: deployment-analysis.json`);
  
  return results;
}

if (require.main === module) {
  analyzeDeployment()
    .then(() => {
      console.log('\n🎉 Analysis complete!');
    })
    .catch(error => {
      console.error('\n💥 Analysis failed:', error);
      process.exit(1);
    });
}