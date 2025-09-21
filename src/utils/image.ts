export function getImagePath(imagePath: string): string {
  // Handle different deployment platforms
  
  if (typeof window !== 'undefined') {
    // Client-side: detect platform and adjust paths accordingly
    const hostname = window.location.hostname;
    
    // GitHub Pages detection
    if (hostname.includes('.github.io')) {
      const hasBasePath = window.location.pathname.startsWith('/my-portfolio');
      if (hasBasePath && !imagePath.startsWith('/my-portfolio')) {
        return `/my-portfolio${imagePath}`;
      }
    }
    
    // Vercel/Netlify/others work with regular paths
    return imagePath;
    
  } else {
    // Server-side: check if we're building for GitHub Pages specifically
    const isGitHubPages = process.env.GITHUB_PAGES === 'true' || 
                         process.env.NODE_ENV === 'production' && 
                         process.env.VERCEL !== '1' && 
                         process.env.NETLIFY !== 'true';
    
    if (isGitHubPages && !imagePath.startsWith('/my-portfolio')) {
      return `/my-portfolio${imagePath}`;
    }
  }
  
  return imagePath;
}