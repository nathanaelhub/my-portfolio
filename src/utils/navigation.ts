// Custom domain (nathanaeljohnson.net) serves from root — no basePath needed
export const basePath = '';

export function getInternalPath(path: string): string {
  // Since Next.js basePath automatically adds the prefix in production,
  // we only need to normalize the path without adding basePath manually

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Add trailing slash for GitHub Pages static hosting (except for root)
  if (process.env.NODE_ENV === 'production' && normalizedPath !== '/' && !normalizedPath.endsWith('/')) {
    return `${normalizedPath}/`;
  }
  
  return normalizedPath;
}