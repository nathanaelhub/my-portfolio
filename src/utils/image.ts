export function getImagePath(imagePath: string): string {
  // Since Next.js assetPrefix already handles the basePath for GitHub Pages,
  // we should NOT add it again here to avoid double prefixing
  
  if (typeof window !== 'undefined') {
    // Client-side: just return the image path as-is
    // assetPrefix in next.config.mjs already handles the GitHub Pages base URL
    return imagePath;
  } else {
    // Server-side: also return as-is since assetPrefix handles the prefixing
    return imagePath;
  }
}