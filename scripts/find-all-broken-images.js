#!/usr/bin/env node

/**
 * FIND ALL BROKEN IMAGE REFERENCES
 *
 * Scans entire project for image references and checks if files exist
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 FINDING ALL BROKEN IMAGE REFERENCES');
console.log('='.repeat(70));
console.log();

const brokenImages = [];
const workingImages = [];

// Helper to check if image exists
function imageExists(imagePath) {
  // Remove leading slash
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join('public', relativePath);
  return fs.existsSync(fullPath);
}

// 1. CHECK content.tsx
console.log('📝 CHECKING src/resources/content.tsx');
console.log('-'.repeat(70));

const contentPath = 'src/resources/content.tsx';
const contentFile = fs.readFileSync(contentPath, 'utf8');

// Extract all image paths (both direct strings and getImagePath calls)
const imageMatches = [
  ...contentFile.matchAll(/["'](\/(images|public)\/[^"']+\.(jpg|jpeg|png|gif|webp|svg))["']/g),
  ...contentFile.matchAll(/getImagePath\(["']([^"']+)["']\)/g)
];

const contentImages = new Set();
imageMatches.forEach(match => {
  const imgPath = match[1];
  contentImages.add(imgPath);
});

console.log(`Found ${contentImages.size} unique image references\n`);

contentImages.forEach(imgPath => {
  if (imageExists(imgPath)) {
    console.log(`  ✅ ${imgPath}`);
    workingImages.push({ file: contentPath, image: imgPath });
  } else {
    console.log(`  ❌ ${imgPath} → FILE NOT FOUND`);
    brokenImages.push({ file: contentPath, image: imgPath });
  }
});

// 2. CHECK blog posts
console.log('\n📰 CHECKING BLOG POSTS (src/app/blog/posts/*.mdx)');
console.log('-'.repeat(70));

const blogDir = 'src/app/blog/posts';
if (fs.existsSync(blogDir)) {
  const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

  console.log(`Found ${posts.length} blog posts\n`);

  posts.forEach(post => {
    const postPath = path.join(blogDir, post);
    const content = fs.readFileSync(postPath, 'utf8');

    // Find markdown images: ![alt](path)
    const mdImages = [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];

    // Find Media/img src attributes
    const srcImages = [...content.matchAll(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp|svg))["']/gi)];

    const allImages = [...mdImages.map(m => m[1]), ...srcImages.map(m => m[1])];

    if (allImages.length > 0) {
      console.log(`  📄 ${post}:`);

      allImages.forEach(imgPath => {
        if (imgPath.startsWith('http')) {
          console.log(`    🌐 ${imgPath} (external)`);
          return;
        }

        if (imageExists(imgPath)) {
          console.log(`    ✅ ${imgPath}`);
          workingImages.push({ file: postPath, image: imgPath });
        } else {
          console.log(`    ❌ ${imgPath} → FILE NOT FOUND`);
          brokenImages.push({ file: postPath, image: imgPath });
        }
      });
      console.log();
    }
  });
} else {
  console.log('  ⚠️  Blog posts directory not found\n');
}

// 3. CHECK work pages
console.log('💼 CHECKING WORK PAGES (src/app/work/projects/*.mdx)');
console.log('-'.repeat(70));

const workDir = 'src/app/work/projects';
if (fs.existsSync(workDir)) {
  const projects = fs.readdirSync(workDir).filter(f => f.endsWith('.mdx'));

  console.log(`Found ${projects.length} project pages\n`);

  projects.forEach(project => {
    const projectPath = path.join(workDir, project);
    const content = fs.readFileSync(projectPath, 'utf8');

    const mdImages = [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
    const srcImages = [...content.matchAll(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp|svg))["']/gi)];

    const allImages = [...mdImages.map(m => m[1]), ...srcImages.map(m => m[1])];

    if (allImages.length > 0) {
      console.log(`  📄 ${project}:`);

      allImages.forEach(imgPath => {
        if (imgPath.startsWith('http')) {
          console.log(`    🌐 ${imgPath} (external)`);
          return;
        }

        if (imageExists(imgPath)) {
          console.log(`    ✅ ${imgPath}`);
          workingImages.push({ file: projectPath, image: imgPath });
        } else {
          console.log(`    ❌ ${imgPath} → FILE NOT FOUND`);
          brokenImages.push({ file: projectPath, image: imgPath });
        }
      });
      console.log();
    }
  });
} else {
  console.log('  ⚠️  Work projects directory not found\n');
}

// 4. CHECK for any TSX/JSX files with image imports
console.log('🔍 CHECKING COMPONENT FILES (src/components/**/*.tsx)');
console.log('-'.repeat(70));

function findTsxFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

const componentFiles = findTsxFiles('src/components');
let componentImagesFound = 0;

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  const srcMatches = [...content.matchAll(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp|svg))["']/gi)];

  if (srcMatches.length > 0) {
    console.log(`  📄 ${file}:`);
    componentImagesFound += srcMatches.length;

    srcMatches.forEach(match => {
      const imgPath = match[1];

      if (imgPath.startsWith('http') || imgPath.startsWith('data:')) {
        return;
      }

      if (imageExists(imgPath)) {
        console.log(`    ✅ ${imgPath}`);
        workingImages.push({ file, image: imgPath });
      } else {
        console.log(`    ❌ ${imgPath} → FILE NOT FOUND`);
        brokenImages.push({ file, image: imgPath });
      }
    });
  }
});

if (componentImagesFound === 0) {
  console.log('  ℹ️  No direct image references found in components\n');
}

// 5. SUMMARY AND RECOMMENDATIONS
console.log('\n' + '='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));

console.log(`\n  ✅ Working images: ${workingImages.length}`);
console.log(`  ❌ Broken images:  ${brokenImages.length}\n`);

if (brokenImages.length > 0) {
  console.log('❌ BROKEN IMAGE REFERENCES:');
  console.log('-'.repeat(70));

  brokenImages.forEach(item => {
    console.log(`\n  File: ${item.file}`);
    console.log(`  Missing: ${item.image}`);

    // Suggest fix
    const imageName = path.basename(item.image);
    const imageDir = path.dirname(item.image);
    const publicPath = path.join('public', imageDir.replace(/^\//, ''));

    if (fs.existsSync(publicPath)) {
      const files = fs.readdirSync(publicPath);
      const similar = files.filter(f =>
        f.toLowerCase().includes(imageName.toLowerCase().replace(/\.(jpg|png|jpeg).*/, ''))
      );

      if (similar.length > 0) {
        console.log(`  💡 Similar files found in ${publicPath}:`);
        similar.forEach(f => console.log(`     - ${f}`));
      }
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('🔧 RECOMMENDED FIXES:');
  console.log('='.repeat(70));
  console.log();

  // Group by type
  const contentBroken = brokenImages.filter(i => i.file.includes('content.tsx'));
  const blogBroken = brokenImages.filter(i => i.file.includes('blog/posts'));
  const workBroken = brokenImages.filter(i => i.file.includes('work/projects'));

  if (contentBroken.length > 0) {
    console.log('  📝 In src/resources/content.tsx:');
    contentBroken.forEach(item => {
      console.log(`     Replace: ${item.image}`);
      console.log(`     With:    (provide correct path or create placeholder)`);
    });
    console.log();
  }

  if (blogBroken.length > 0) {
    console.log('  📰 In blog posts:');
    blogBroken.forEach(item => {
      console.log(`     File: ${item.file}`);
      console.log(`     Fix:  ${item.image}`);
    });
    console.log();
  }

  if (workBroken.length > 0) {
    console.log('  💼 In work/project pages:');
    workBroken.forEach(item => {
      console.log(`     File: ${item.file}`);
      console.log(`     Fix:  ${item.image}`);
    });
    console.log();
  }

  process.exit(1);
} else {
  console.log('✅ NO BROKEN IMAGE REFERENCES FOUND!');
  console.log('\nAll image paths are valid and files exist.\n');
  process.exit(0);
}