#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const GITHUB_BASE_URL = 'https://nathanaelhub.github.io/my-portfolio';

console.log('🔧 Starting brute-force image URL fixing...');

async function fixImageUrls() {
  try {
    // Find all HTML files in the out directory
    const htmlFiles = await glob('out/**/*.html', { 
      cwd: process.cwd(),
      absolute: true 
    });
    
    console.log(`📄 Found ${htmlFiles.length} HTML files to process`);
    
    let totalFilesModified = 0;
    let totalReplacements = 0;
    
    for (const filePath of htmlFiles) {
      console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);
      
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Count replacements
      let fileReplacements = 0;
      
      // Fix image src attributes
      const imgMatches = content.match(/src="[^"]*"/g) || [];
      content = content.replace(/src="\/my-portfolio\/images\//g, (match) => {
        fileReplacements++;
        return `src="${GITHUB_BASE_URL}/images/`;
      });
      
      content = content.replace(/src="\/images\//g, (match) => {
        fileReplacements++;
        return `src="${GITHUB_BASE_URL}/images/`;
      });
      
      // Fix href attributes for internal links
      content = content.replace(/href="\/my-portfolio\//g, (match) => {
        fileReplacements++;
        return `href="${GITHUB_BASE_URL}/`;
      });
      
      // Fix any remaining relative URLs that start with /
      content = content.replace(/href="\/(?!\/)/g, (match) => {
        fileReplacements++;
        return `href="${GITHUB_BASE_URL}/`;
      });
      
      // Fix CSS background images
      content = content.replace(/url\(\/my-portfolio\//g, (match) => {
        fileReplacements++;
        return `url(${GITHUB_BASE_URL}/`;
      });
      
      content = content.replace(/url\(\/(?!\/)/g, (match) => {
        fileReplacements++;
        return `url(${GITHUB_BASE_URL}/`;
      });
      
      // Fix any JSON or JavaScript that might contain image paths
      content = content.replace(/"\/my-portfolio\/images\//g, (match) => {
        fileReplacements++;
        return `"${GITHUB_BASE_URL}/images/`;
      });
      
      content = content.replace(/"\/images\//g, (match) => {
        fileReplacements++;
        return `"${GITHUB_BASE_URL}/images/`;
      });
      
      // Handle srcset attributes for responsive images
      content = content.replace(/srcset="[^"]*"/g, (match) => {
        const fixed = match
          .replace(/\/my-portfolio\/images\//g, `${GITHUB_BASE_URL}/images/`)
          .replace(/\/images\//g, `${GITHUB_BASE_URL}/images/`);
        
        if (fixed !== match) {
          fileReplacements++;
        }
        return fixed;
      });
      
      // Fix meta property content (for og:image, etc.)
      content = content.replace(/content="[^"]*"/g, (match) => {
        if (match.includes('/images/') || match.includes('/my-portfolio/')) {
          const fixed = match
            .replace(/\/my-portfolio\//g, `${GITHUB_BASE_URL}/`)
            .replace(/content="\/(?!\/)/g, `content="${GITHUB_BASE_URL}/`);
          
          if (fixed !== match) {
            fileReplacements++;
          }
          return fixed;
        }
        return match;
      });
      
      // Write the file if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        totalFilesModified++;
        totalReplacements += fileReplacements;
        console.log(`   ✅ Fixed ${fileReplacements} URLs`);
      } else {
        console.log(`   ⏭️  No changes needed`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Files processed: ${htmlFiles.length}`);
    console.log(`   Files modified: ${totalFilesModified}`);
    console.log(`   Total URL fixes: ${totalReplacements}`);
    
    // Also fix any CSS files
    const cssFiles = await glob('out/**/*.css', { 
      cwd: process.cwd(),
      absolute: true 
    });
    
    console.log(`\n🎨 Processing ${cssFiles.length} CSS files...`);
    
    for (const filePath of cssFiles) {
      console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix CSS URLs
      content = content.replace(/url\(\/my-portfolio\//g, `url(${GITHUB_BASE_URL}/`);
      content = content.replace(/url\(\/(?!\/)/g, `url(${GITHUB_BASE_URL}/`);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Fixed CSS URLs`);
      } else {
        console.log(`   ⏭️  No changes needed`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error fixing image URLs:', error);
    throw error;
  }
}

if (require.main === module) {
  fixImageUrls()
    .then(() => {
      console.log('🎉 Image URL fixing complete!');
    })
    .catch(error => {
      console.error('💥 Image URL fixing failed:', error);
      process.exit(1);
    });
}

module.exports = { fixImageUrls };