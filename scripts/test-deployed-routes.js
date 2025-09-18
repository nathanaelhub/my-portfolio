#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.SITE_URL || 'https://nathanaelhub.github.io/my-portfolio';
const BASE_PATH = '/my-portfolio';

// Routes to test
const ROUTES_TO_TEST = [
  '/',
  '/about',
  '/gallery', 
  '/blog',
  '/work',
  '/404',
  // Dynamic routes
  '/blog/quick-start',
  '/blog/components',
  '/work/mental-health-llm-evaluation',
  '/work/airline-revenue-optimization',
  // Trailing slash variants
  '/about/',
  '/gallery/',
  '/blog/',
  '/work/'
];

// Image assets to test
const IMAGE_ASSETS_TO_TEST = [
  '/images/avatar.jpg',
  '/images/gallery/image-01.jpg',
  '/images/projects/mental-health-llm.jpg'
];

class RouteTestRunner {
  constructor(baseUrl, basePath) {
    this.baseUrl = baseUrl;
    this.basePath = basePath;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🚀 GitHub Pages Route Testing');
    console.log('=============================');
    console.log(`🌐 Base URL: ${this.baseUrl}`);
    console.log(`📂 Base Path: ${this.basePath}`);
    console.log(`📅 Started: ${new Date().toISOString()}\n`);

    // Test main routes
    console.log('🔗 Testing Main Routes:');
    console.log('=======================');
    for (const route of ROUTES_TO_TEST) {
      await this.testRoute(route);
    }

    // Test image assets
    console.log('\n🖼️  Testing Image Assets:');
    console.log('========================');
    for (const asset of IMAGE_ASSETS_TO_TEST) {
      await this.testAsset(asset);
    }

    // Test navigation link integrity
    console.log('\n🧭 Testing Navigation Links:');
    console.log('============================');
    await this.testNavigationLinks();

    // Test basePath handling
    console.log('\n🔧 Testing BasePath Handling:');
    console.log('=============================');
    await this.testBasePathHandling();

    // Test 404 fallback
    console.log('\n🚫 Testing 404 Fallback:');
    console.log('========================');
    await this.testNotFoundHandling();

    this.printSummary();
    return this.results;
  }

  async testRoute(route) {
    const fullUrl = this.baseUrl + route;
    const testName = `Route: ${route}`;
    
    try {
      const response = await this.fetchWithTimeout(fullUrl, 10000);
      const result = this.analyzeRouteResponse(response, route);
      
      this.addTestResult(testName, result.passed, result.message, {
        url: fullUrl,
        statusCode: response.statusCode,
        contentLength: response.body?.length || 0,
        hasHtmlContent: result.hasHtmlContent,
        hasValidNavigation: result.hasValidNavigation
      });

      if (result.passed) {
        console.log(`  ✅ ${route} - ${result.message}`);
      } else {
        console.log(`  ❌ ${route} - ${result.message}`);
      }

    } catch (error) {
      this.addTestResult(testName, false, `Request failed: ${error.message}`, {
        url: fullUrl,
        error: error.message
      });
      console.log(`  ❌ ${route} - Request failed: ${error.message}`);
    }
  }

  async testAsset(assetPath) {
    const fullUrl = this.baseUrl + assetPath;
    const testName = `Asset: ${assetPath}`;
    
    try {
      const response = await this.fetchWithTimeout(fullUrl, 5000);
      const passed = response.statusCode === 200;
      const message = passed ? 'Asset loads correctly' : `HTTP ${response.statusCode}`;
      
      this.addTestResult(testName, passed, message, {
        url: fullUrl,
        statusCode: response.statusCode,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length']
      });

      if (passed) {
        console.log(`  ✅ ${assetPath} - ${message}`);
      } else {
        console.log(`  ❌ ${assetPath} - ${message}`);
      }

    } catch (error) {
      this.addTestResult(testName, false, `Asset request failed: ${error.message}`, {
        url: fullUrl,
        error: error.message
      });
      console.log(`  ❌ ${assetPath} - Request failed: ${error.message}`);
    }
  }

  async testNavigationLinks() {
    try {
      const homepageUrl = this.baseUrl + '/';
      const response = await this.fetchWithTimeout(homepageUrl, 10000);
      
      if (response.statusCode !== 200) {
        this.addTestResult('Navigation Links', false, 'Could not fetch homepage to test navigation');
        console.log('  ❌ Could not fetch homepage to test navigation');
        return;
      }

      const navigationLinks = this.extractNavigationLinks(response.body);
      let validLinks = 0;
      let totalLinks = navigationLinks.length;

      console.log(`  🔍 Found ${totalLinks} navigation links`);

      for (const link of navigationLinks) {
        if (this.isValidInternalLink(link)) {
          validLinks++;
          console.log(`    ✅ ${link}`);
        } else {
          console.log(`    ❌ ${link} - Invalid basePath or format`);
        }
      }

      const passed = totalLinks > 0 && validLinks === totalLinks;
      const message = `${validLinks}/${totalLinks} navigation links valid`;
      
      this.addTestResult('Navigation Links', passed, message, {
        totalLinks,
        validLinks,
        links: navigationLinks
      });

    } catch (error) {
      this.addTestResult('Navigation Links', false, `Navigation test failed: ${error.message}`);
      console.log(`  ❌ Navigation test failed: ${error.message}`);
    }
  }

  async testBasePathHandling() {
    // Test direct access with and without basePath
    const testCases = [
      { url: this.baseUrl + '/about', description: 'Direct access with basePath' },
      { url: this.baseUrl.replace(this.basePath, '') + '/about', description: 'Direct access without basePath' }
    ];

    for (const testCase of testCases) {
      try {
        const response = await this.fetchWithTimeout(testCase.url, 5000);
        const passed = response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302;
        const message = passed ? `HTTP ${response.statusCode}` : `Failed with HTTP ${response.statusCode}`;
        
        this.addTestResult(`BasePath: ${testCase.description}`, passed, message, {
          url: testCase.url,
          statusCode: response.statusCode
        });

        if (passed) {
          console.log(`  ✅ ${testCase.description} - ${message}`);
        } else {
          console.log(`  ❌ ${testCase.description} - ${message}`);
        }

      } catch (error) {
        this.addTestResult(`BasePath: ${testCase.description}`, false, `Request failed: ${error.message}`);
        console.log(`  ❌ ${testCase.description} - Request failed: ${error.message}`);
      }
    }
  }

  async testNotFoundHandling() {
    const notFoundUrls = [
      this.baseUrl + '/non-existent-page',
      this.baseUrl + '/blog/non-existent-post',
      this.baseUrl + '/work/non-existent-project'
    ];

    for (const url of notFoundUrls) {
      try {
        const response = await this.fetchWithTimeout(url, 5000);
        const isProperlyHandled = response.statusCode === 404 || 
                                (response.statusCode === 200 && response.body.includes('404'));
        
        const message = isProperlyHandled ? 
          `Properly handled with HTTP ${response.statusCode}` :
          `Unexpected response: HTTP ${response.statusCode}`;
        
        this.addTestResult(`404 Handling: ${new URL(url).pathname}`, isProperlyHandled, message, {
          url,
          statusCode: response.statusCode,
          hasCustom404: response.body?.includes('404') || false
        });

        if (isProperlyHandled) {
          console.log(`  ✅ ${new URL(url).pathname} - ${message}`);
        } else {
          console.log(`  ❌ ${new URL(url).pathname} - ${message}`);
        }

      } catch (error) {
        this.addTestResult(`404 Handling: ${new URL(url).pathname}`, false, `Request failed: ${error.message}`);
        console.log(`  ❌ ${new URL(url).pathname} - Request failed: ${error.message}`);
      }
    }
  }

  analyzeRouteResponse(response, route) {
    if (response.statusCode !== 200) {
      return {
        passed: false,
        message: `HTTP ${response.statusCode}`,
        hasHtmlContent: false,
        hasValidNavigation: false
      };
    }

    const body = response.body;
    if (!body) {
      return {
        passed: false,
        message: 'Empty response body',
        hasHtmlContent: false,
        hasValidNavigation: false
      };
    }

    // Check for HTML content vs just JavaScript
    const hasHtmlStructure = body.includes('<html') && body.includes('<body');
    const hasMainContent = body.includes('<main') || body.includes('id="__next"');
    const hasTitle = body.includes('<title>') && !body.includes('<title></title>');
    const hasMetaTags = body.includes('<meta');
    
    // Check if it's just a redirect or loading page
    const isRedirectPage = body.includes('Redirecting') && body.includes('window.location');
    
    // For the 404 page, redirecting is expected
    if (route === '/404' && isRedirectPage) {
      return {
        passed: true,
        message: '404 redirect page working',
        hasHtmlContent: true,
        hasValidNavigation: false
      };
    }

    if (!hasHtmlStructure) {
      return {
        passed: false,
        message: 'No HTML structure found',
        hasHtmlContent: false,
        hasValidNavigation: false
      };
    }

    if (isRedirectPage && route !== '/404') {
      return {
        passed: false,
        message: 'Page showing redirect instead of content',
        hasHtmlContent: false,
        hasValidNavigation: false
      };
    }

    // Check navigation links
    const hasValidNavigation = this.checkNavigationInContent(body);

    const contentQuality = this.assessContentQuality(body, route);
    
    return {
      passed: hasHtmlStructure && hasMainContent && hasTitle && contentQuality.hasContent,
      message: contentQuality.message,
      hasHtmlContent: true,
      hasValidNavigation
    };
  }

  assessContentQuality(body, route) {
    // Extract text content (simple approximation)
    const textContent = body
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const contentLength = textContent.length;
    
    // Different expectations for different pages
    let minExpectedLength = 100;
    if (route === '/' || route === '/about') minExpectedLength = 200;
    if (route.startsWith('/blog/') || route.startsWith('/work/')) minExpectedLength = 300;

    if (contentLength < minExpectedLength) {
      return {
        hasContent: false,
        message: `Insufficient content: ${contentLength} chars (expected >${minExpectedLength})`
      };
    }

    // Check for common content indicators
    const hasNavigation = body.includes('nav') || body.includes('menu');
    const hasHeadings = body.includes('<h1') || body.includes('<h2');
    const hasFooter = body.includes('<footer') || body.includes('footer');

    if (!hasNavigation || !hasHeadings) {
      return {
        hasContent: false,
        message: 'Missing expected page structure (nav/headings)'
      };
    }

    return {
      hasContent: true,
      message: `Valid content (${contentLength} chars)`
    };
  }

  extractNavigationLinks(body) {
    const links = [];
    const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
    let match;

    while ((match = linkRegex.exec(body)) !== null) {
      const href = match[1];
      // Only internal links that could be navigation
      if (href.startsWith('/') && !href.startsWith('//') && !href.includes('.')) {
        links.push(href);
      }
    }

    // Remove duplicates and filter to main navigation
    const uniqueLinks = [...new Set(links)];
    return uniqueLinks.filter(link => 
      link === '/' || 
      link === '/about' || 
      link === '/about/' ||
      link === '/gallery' || 
      link === '/gallery/' ||
      link === '/blog' || 
      link === '/blog/' ||
      link === '/work' ||
      link === '/work/'
    );
  }

  isValidInternalLink(link) {
    // Check if link uses correct basePath format
    const validFormats = [
      '/',
      '/about',
      '/about/',
      '/gallery',
      '/gallery/',
      '/blog',
      '/blog/',
      '/work',
      '/work/'
    ];

    return validFormats.includes(link);
  }

  checkNavigationInContent(body) {
    // Simple check for navigation with proper links
    const hasNavTag = body.includes('<nav') || body.includes('role="navigation"');
    const hasMenuLinks = body.includes('href="/about') || body.includes('href="/gallery');
    
    return hasNavTag && hasMenuLinks;
  }

  async fetchWithTimeout(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const timeoutId = setTimeout(() => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);

      const req = client.get(url, (res) => {
        clearTimeout(timeoutId);
        
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  addTestResult(name, passed, message, details = {}) {
    this.results.total++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }

    this.results.tests.push({
      name,
      passed,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Total tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`Success rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      console.log('================');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  ${test.name}: ${test.message}`);
        });
    }

    console.log(`\n🏁 Testing completed at: ${new Date().toISOString()}`);
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// CLI support
if (require.main === module) {
  const baseUrl = process.argv[2] || BASE_URL;
  const basePath = process.argv[3] || BASE_PATH;
  
  const runner = new RouteTestRunner(baseUrl, basePath);
  runner.runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { RouteTestRunner };