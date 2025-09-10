export function getInternalPath(path: string): string {
  // For GitHub Pages, we need to ensure paths are correct
  const basePath = process.env.NODE_ENV === 'production' ? '/my-portfolio' : '';
  
  // If path already has basePath, don't add it again
  if (path.startsWith(basePath)) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Add trailing slash for GitHub Pages static hosting (except for root)
  const fullPath = `${basePath}${normalizedPath}`;
  if (process.env.NODE_ENV === 'production' && fullPath !== basePath && !fullPath.endsWith('/')) {
    return `${fullPath}/`;
  }
  
  return fullPath;
}