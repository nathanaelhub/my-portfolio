export function getInternalPath(path: string): string {
  // Next.js basePath should handle this automatically for internal links
  // We return the path as-is for Next.js to handle
  return path;
}