import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],

  // Static export for GitHub Pages with custom domain
  output: "export",
  
  // Disable image optimization completely for GitHub Pages
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

  // Webpack configuration for GitHub Pages
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