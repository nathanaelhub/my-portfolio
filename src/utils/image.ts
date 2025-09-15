export function getImagePath(imagePath: string): string {
  // Next.js assetPrefix automatically handles the basePath for production
  // No need to manually add basePath since it's configured in next.config.mjs
  return imagePath;
}