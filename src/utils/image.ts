// Get basePath from environment - must match next.config.mjs
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/my-portfolio' : '';

export function getImagePath(imagePath: string): string {
  // Skip if already prefixed, external URL, or empty
  if (!imagePath ||
      imagePath.startsWith('http') ||
      imagePath.startsWith('data:') ||
      imagePath.startsWith(basePath)) {
    return imagePath;
  }

  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Add basePath for production (GitHub Pages)
  return `${basePath}${normalizedPath}`;
}