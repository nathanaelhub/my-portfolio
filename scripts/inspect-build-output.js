#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const BUILD_DIR = 'out';
const EXPECTED_PAGES = [
  'index.html',
  'about/index.html', 
  'gallery/index.html',
  'blog/index.html',
  'work/index.html',
  '404.html'
];

// Expected dynamic routes based on content
const EXPECTED_DYNAMIC_ROUTES = {
  blog: [
    'blog/blog/index.html',
    'blog/components/index.html',
    'blog/content/index.html',
    'blog/localization/index.html',
    'blog/mailchimp/index.html',
    'blog/pages/index.html',
    'blog/password/index.html',
    'blog/quick-start/index.html',
    'blog/seo/index.html',
    'blog/styling/index.html',
    'blog/work/index.html'
  ],
  work: [
    'work/airline-revenue-optimization/index.html',
    'work/automate-design-handovers-with-a-figma-to-code-pipeline/index.html',
    'work/building-once-ui-a-customizable-design-system/index.html',
    'work/f1-race-predictor/index.html',
    'work/mental-health-llm-evaluation/index.html',
    'work/nashville-airbnb-analysis/index.html',
    'work/portfolio-optimization-dashboard/index.html',
    'work/simple-portfolio-builder/index.html'
  ]
};

function inspectBuildOutput() {
  console.log('🔍 Inspecting Next.js Build Output');
  console.log('=====================================\n');
  
  // Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`❌ Build directory '${BUILD_DIR}' not found!`);
    console.log('💡 Run "npm run build" first to generate the build output.');
    process.exit(1);
  }

  console.log(`📂 Build directory: ${path.resolve(BUILD_DIR)}\n`);

  // 1. Get all generated HTML files
  const generatedHtmlFiles = getAllHtmlFiles(BUILD_DIR);
  console.log('📄 Generated HTML Files:');
  console.log('========================');
  
  const htmlFileStats = [];
  generatedHtmlFiles.forEach(file => {
    const relativePath = path.relative(BUILD_DIR, file);
    const stats = fs.statSync(file);
    const size = Math.round(stats.size / 1024);
    const route = getRouteFromFile(relativePath);
    
    htmlFileStats.push({
      file: relativePath,
      route: route,
      size: size,
      fullPath: file
    });
    
    console.log(`  ✅ ${route} → ${relativePath} (${size}KB)`);
  });

  console.log(`\n📊 Total HTML files generated: ${generatedHtmlFiles.length}\n`);

  // 2. Check for missing expected pages
  console.log('🔍 Missing Expected Pages:');
  console.log('==========================');
  
  const missingPages = [];
  const allExpectedPages = [
    ...EXPECTED_PAGES,
    ...EXPECTED_DYNAMIC_ROUTES.blog,
    ...EXPECTED_DYNAMIC_ROUTES.work
  ];
  
  allExpectedPages.forEach(expectedPage => {
    const expectedPath = path.join(BUILD_DIR, expectedPage);
    if (!fs.existsSync(expectedPath)) {
      missingPages.push(expectedPage);
      console.log(`  ❌ Missing: ${expectedPage}`);
    }
  });
  
  if (missingPages.length === 0) {
    console.log('  ✅ All expected pages are present!');
  }
  console.log('');

  // 3. Analyze HTML content vs JavaScript-only pages
  console.log('🧐 HTML Content Analysis:');
  console.log('=========================');
  
  const jsOnlyPages = [];
  const htmlContentPages = [];
  
  htmlFileStats.forEach(({ file, fullPath, route, size }) => {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const analysis = analyzeHtmlContent(content, route);
      
      if (analysis.isJsOnly) {
        jsOnlyPages.push({ file, route, size, reason: analysis.reason });
        console.log(`  ⚠️  JS-Only: ${route} (${analysis.reason})`);
      } else {
        htmlContentPages.push({ file, route, size, contentSize: analysis.contentSize });
        console.log(`  ✅ HTML Content: ${route} (${analysis.contentSize} chars of content)`);
      }
    } catch (error) {
      console.log(`  ❌ Error reading ${file}: ${error.message}`);
    }
  });

  console.log('');

  // 4. Check asset references in HTML files
  console.log('🖼️  Asset Reference Analysis:');
  console.log('============================');
  
  const assetIssues = [];
  const assetSummary = {
    images: new Set(),
    stylesheets: new Set(),
    scripts: new Set(),
    brokenReferences: []
  };

  htmlFileStats.forEach(({ file, fullPath, route }) => {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const assets = analyzeAssetReferences(content, route, BUILD_DIR);
      
      // Collect all assets
      assets.images.forEach(img => assetSummary.images.add(img));
      assets.stylesheets.forEach(css => assetSummary.stylesheets.add(css));
      assets.scripts.forEach(js => assetSummary.scripts.add(js));
      
      // Check for broken references
      assets.broken.forEach(broken => {
        assetSummary.brokenReferences.push({ page: route, asset: broken });
        assetIssues.push(`${route}: ${broken}`);
      });
      
    } catch (error) {
      console.log(`  ❌ Error analyzing assets in ${file}: ${error.message}`);
    }
  });

  console.log(`  📄 Stylesheets found: ${assetSummary.stylesheets.size}`);
  console.log(`  📜 JavaScript files found: ${assetSummary.scripts.size}`);
  console.log(`  🖼️  Images referenced: ${assetSummary.images.size}`);
  
  if (assetSummary.brokenReferences.length > 0) {
    console.log(`  ❌ Broken asset references: ${assetSummary.brokenReferences.length}`);
    assetSummary.brokenReferences.forEach(({ page, asset }) => {
      console.log(`    ${page}: ${asset}`);
    });
  } else {
    console.log('  ✅ No broken asset references found');
  }
  
  console.log('');

  // 5. File size analysis
  console.log('📊 File Size Analysis:');
  console.log('=====================');
  
  const sortedBySize = [...htmlFileStats].sort((a, b) => b.size - a.size);
  const largeFiles = sortedBySize.filter(f => f.size > 100);
  const smallFiles = sortedBySize.filter(f => f.size < 10);
  
  console.log('🔝 Largest HTML files:');
  sortedBySize.slice(0, 5).forEach(({ route, size }) => {
    console.log(`  ${route}: ${size}KB`);
  });
  
  if (largeFiles.length > 0) {
    console.log(`\n⚠️  Large files (>100KB): ${largeFiles.length}`);
    largeFiles.forEach(({ route, size }) => {
      console.log(`  ${route}: ${size}KB`);
    });
  }
  
  if (smallFiles.length > 0) {
    console.log(`\n🤏 Small files (<10KB): ${smallFiles.length}`);
    smallFiles.forEach(({ route, size }) => {
      console.log(`  ${route}: ${size}KB`);
    });
  }

  // 6. Summary and recommendations
  console.log('\n📋 Summary & Recommendations:');
  console.log('=============================');
  
  console.log(`✅ HTML files generated: ${generatedHtmlFiles.length}`);
  console.log(`✅ Pages with HTML content: ${htmlContentPages.length}`);
  
  if (jsOnlyPages.length > 0) {
    console.log(`⚠️  JavaScript-only pages: ${jsOnlyPages.length}`);
    console.log('💡 Consider adding "export const dynamic = \\"force-static\\"" to these pages');
  }
  
  if (missingPages.length > 0) {
    console.log(`❌ Missing expected pages: ${missingPages.length}`);
    console.log('💡 Check if these routes are properly configured or if content exists');
  }
  
  if (assetSummary.brokenReferences.length > 0) {
    console.log(`❌ Broken asset references: ${assetSummary.brokenReferences.length}`);
    console.log('💡 Fix asset paths or ensure files exist in the build output');
  }
  
  // Build health score
  const healthScore = calculateHealthScore(generatedHtmlFiles.length, missingPages.length, jsOnlyPages.length, assetSummary.brokenReferences.length);
  console.log(`\n🏥 Build Health Score: ${healthScore}/100`);
  
  if (healthScore >= 90) {
    console.log('🎉 Excellent! Your build output looks great.');
  } else if (healthScore >= 70) {
    console.log('👍 Good build, but there are some areas for improvement.');
  } else {
    console.log('⚠️  Build needs attention. Review the issues above.');
  }
}

function getAllHtmlFiles(dir) {
  let htmlFiles = [];
  
  if (!fs.existsSync(dir)) return htmlFiles;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      htmlFiles = htmlFiles.concat(getAllHtmlFiles(fullPath));
    } else if (stat.isFile() && item.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
  
  return htmlFiles;
}

function getRouteFromFile(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath === '404.html') return '/404';
  
  // Convert file path to route
  let route = '/' + relativePath.replace('/index.html', '').replace('.html', '');
  return route;
}

function analyzeHtmlContent(content, route) {
  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Check for actual content vs just JavaScript
    const bodyText = document.body?.textContent?.trim() || '';
    const hasContent = bodyText.length > 100; // Arbitrary threshold
    
    // Check for common indicators of JS-only pages
    const hasNextScript = content.includes('__NEXT_DATA__');
    const hasMainContent = document.querySelector('main, article, section, .content');
    const hasNavigation = document.querySelector('nav, .nav, .navigation');
    
    // Check if it's mostly just loading/redirect scripts
    const isRedirectPage = content.includes('window.location') && bodyText.includes('Redirecting');
    
    if (isRedirectPage) {
      return { isJsOnly: false, reason: 'redirect page', contentSize: bodyText.length };
    }
    
    if (!hasContent && !hasMainContent) {
      return { isJsOnly: true, reason: 'minimal content, likely JS hydration only' };
    }
    
    if (bodyText.length < 50 && !hasNavigation) {
      return { isJsOnly: true, reason: 'very minimal content' };
    }
    
    return { isJsOnly: false, contentSize: bodyText.length };
    
  } catch (error) {
    return { isJsOnly: true, reason: `parse error: ${error.message}` };
  }
}

function analyzeAssetReferences(content, route, buildDir) {
  const assets = {
    images: [],
    stylesheets: [],
    scripts: [],
    broken: []
  };
  
  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Find images
    const images = document.querySelectorAll('img[src], source[src]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        assets.images.push(src);
        
        // Check if image exists (for relative paths)
        if (src.startsWith('/') && !src.startsWith('//')) {
          const imagePath = path.join(buildDir, src.replace(/^\//, ''));
          if (!fs.existsSync(imagePath)) {
            assets.broken.push(`Image not found: ${src}`);
          }
        }
      }
    });
    
    // Find stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        assets.stylesheets.push(href);
      }
    });
    
    // Find scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        assets.scripts.push(src);
      }
    });
    
  } catch (error) {
    assets.broken.push(`HTML parse error: ${error.message}`);
  }
  
  return assets;
}

function calculateHealthScore(totalFiles, missingFiles, jsOnlyFiles, brokenRefs) {
  let score = 100;
  
  // Deduct points for issues
  score -= (missingFiles * 10); // 10 points per missing file
  score -= (jsOnlyFiles * 5);   // 5 points per JS-only file
  score -= (brokenRefs * 3);    // 3 points per broken reference
  
  // Bonus for having files
  if (totalFiles >= 20) score += 5;
  if (totalFiles >= 30) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

// Only run if called directly
if (require.main === module) {
  // Check if jsdom is available
  try {
    require('jsdom');
  } catch (error) {
    console.log('📦 Installing jsdom for HTML analysis...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install jsdom --save-dev', { stdio: 'inherit' });
      console.log('✅ jsdom installed successfully\n');
    } catch (installError) {
      console.log('⚠️  Could not install jsdom. HTML content analysis will be limited.\n');
    }
  }
  
  inspectBuildOutput();
}

module.exports = { inspectBuildOutput };