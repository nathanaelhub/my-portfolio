#!/usr/bin/env node

/**
 * CHECK BLOG POST IMAGES
 *
 * Scans all blog posts for image references and verifies they exist
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKING BLOG POST IMAGES');
console.log('='.repeat(70));
console.log();

const BLOG_DIR = 'src/app/blog/posts';
const PUBLIC_DIR = 'public';

const brokenImages = [];
const workingImages = [];

function imageExists(imagePath) {
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  return fs.existsSync(fullPath);
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  });

  return frontmatter;
}

function extractImageReferences(content, filename) {
  const images = [];

  // Find markdown images: ![alt](path)
  const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match;

  while ((match = mdImageRegex.exec(content)) !== null) {
    images.push({
      type: 'markdown',
      path: match[1],
      line: content.substring(0, match.index).split('\n').length
    });
  }

  // Find Media/img src attributes
  const srcRegex = /src=["']([^"']+\.(?:jpg|jpeg|png|gif|webp|svg))["']/gi;

  while ((match = srcRegex.exec(content)) !== null) {
    images.push({
      type: 'src',
      path: match[1],
      line: content.substring(0, match.index).split('\n').length
    });
  }

  return images;
}

// Get all blog posts
if (!fs.existsSync(BLOG_DIR)) {
  console.log('❌ Blog posts directory not found:', BLOG_DIR);
  process.exit(1);
}

const posts = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith('.mdx'))
  .sort();

console.log(`Found ${posts.length} blog posts\n`);

let totalBroken = 0;
let totalWorking = 0;
let postsWithIssues = 0;

posts.forEach(post => {
  const postPath = path.join(BLOG_DIR, post);
  const content = fs.readFileSync(postPath, 'utf8');

  console.log(`📄 ${post}`);
  console.log('-'.repeat(70));

  // Check frontmatter for image
  const frontmatter = extractFrontmatter(content);
  const imageRefs = extractImageReferences(content, post);

  let hasIssues = false;

  // Check frontmatter image (if exists)
  if (frontmatter.image) {
    const imgPath = frontmatter.image;

    if (imgPath.startsWith('http')) {
      console.log(`  🌐 Frontmatter image: ${imgPath} (external)`);
    } else if (imageExists(imgPath)) {
      console.log(`  ✅ Frontmatter image: ${imgPath}`);
      workingImages.push({ post, type: 'frontmatter', image: imgPath });
      totalWorking++;
    } else {
      console.log(`  ❌ Frontmatter image: ${imgPath} → FILE NOT FOUND`);
      brokenImages.push({ post, type: 'frontmatter', image: imgPath });
      totalBroken++;
      hasIssues = true;
    }
  }

  // Check content images
  if (imageRefs.length > 0) {
    console.log(`  Found ${imageRefs.length} image reference(s) in content:`);

    imageRefs.forEach(ref => {
      const imgPath = ref.path;

      if (imgPath.startsWith('http')) {
        console.log(`    🌐 Line ${ref.line}: ${imgPath} (external)`);
      } else if (imageExists(imgPath)) {
        console.log(`    ✅ Line ${ref.line}: ${imgPath}`);
        workingImages.push({ post, type: ref.type, image: imgPath, line: ref.line });
        totalWorking++;
      } else {
        console.log(`    ❌ Line ${ref.line}: ${imgPath} → FILE NOT FOUND`);
        brokenImages.push({ post, type: ref.type, image: imgPath, line: ref.line });
        totalBroken++;
        hasIssues = true;
      }
    });
  } else if (!frontmatter.image) {
    console.log('  ℹ️  No images found');
  }

  if (hasIssues) {
    postsWithIssues++;
  }

  console.log();
});

// Summary
console.log('='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log();
console.log(`  Total posts scanned:      ${posts.length}`);
console.log(`  Posts with broken images: ${postsWithIssues}`);
console.log(`  Working image refs:       ${totalWorking}`);
console.log(`  Broken image refs:        ${totalBroken}`);
console.log();

if (brokenImages.length > 0) {
  console.log('❌ BROKEN IMAGE REFERENCES');
  console.log('='.repeat(70));
  console.log();

  brokenImages.forEach(item => {
    console.log(`📄 ${item.post}`);
    console.log(`   Type: ${item.type}`);
    console.log(`   Missing: ${item.image}`);
    if (item.line) {
      console.log(`   Line: ${item.line}`);
    }

    // Suggest fixes
    const imageName = path.basename(item.image);
    const imageExt = path.extname(item.image);

    console.log(`   💡 Suggested fixes:`);
    console.log(`      1. Create placeholder image at: public${item.image}`);
    console.log(`      2. Use existing project image: /images/projects/mental-health-llm/cover.png`);
    console.log(`      3. Remove the image reference`);
    console.log();
  });

  console.log('='.repeat(70));
  console.log('🔧 RECOMMENDED ACTIONS');
  console.log('='.repeat(70));
  console.log();

  // Group broken images by post
  const brokenByPost = {};
  brokenImages.forEach(item => {
    if (!brokenByPost[item.post]) {
      brokenByPost[item.post] = [];
    }
    brokenByPost[item.post].push(item);
  });

  Object.keys(brokenByPost).forEach(post => {
    const issues = brokenByPost[post];
    console.log(`📝 Fix ${post}:`);

    issues.forEach(issue => {
      if (issue.type === 'frontmatter') {
        console.log(`   - Update frontmatter 'image:' field`);
        console.log(`     Current: ${issue.image}`);
        console.log(`     Replace with: /images/projects/mental-health-llm/cover.png`);
      } else {
        console.log(`   - Fix line ${issue.line}`);
        console.log(`     Replace: ${issue.image}`);
        console.log(`     With: /images/projects/mental-health-llm/cover.png`);
      }
    });
    console.log();
  });

  process.exit(1);
} else {
  console.log('✅ NO BROKEN IMAGE REFERENCES FOUND!');
  console.log();
  console.log('All blog post images are valid and files exist.');
  console.log();
  process.exit(0);
}