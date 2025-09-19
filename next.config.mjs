import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

// GitHub Pages deployment configuration
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/my-portfolio' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  
  // Static export for GitHub Pages
  output: "export",
  
  // GitHub Pages configuration
  basePath: basePath,
  assetPrefix: basePath,
  
  // Ensure trailing slashes for GitHub Pages
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  
  // SASS configuration
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },

  // Webpack configuration for proper asset handling
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle assets properly for GitHub Pages
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        // Create a vendors chunk
        vendor: {
          name: 'vendors',
          chunks: 'all',
          test: /node_modules/
        }
      }
    }
    return config;
  }
};

export default withMDX(nextConfig);