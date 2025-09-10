export function getImagePath(imagePath: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/my-portfolio' : '';
  return `${basePath}${imagePath}`;
}