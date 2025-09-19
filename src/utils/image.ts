export function getImagePath(imagePath: string): string {
  // For GitHub Pages deployment, we need to handle basePath manually for images
  // since Next.js assetPrefix doesn't always work correctly with static exports
  
  if (typeof window !== 'undefined') {
    // Client-side: use current pathname to determine if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('.github.io');
    const hasBasePath = window.location.pathname.startsWith('/my-portfolio');
    
    if (isGitHubPages && hasBasePath && !imagePath.startsWith('/my-portfolio')) {
      return `/my-portfolio${imagePath}`;
    }
  } else {
    // Server-side: use environment variable
    const isProduction = process.env.NODE_ENV === 'production';
    const basePath = isProduction ? '/my-portfolio' : '';
    
    if (basePath && !imagePath.startsWith(basePath)) {
      return `${basePath}${imagePath}`;
    }
  }
  
  return imagePath;
}