import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack to treat this directory as the workspace root to avoid crawling parent folders.
    root: __dirname,
  },
};

export default nextConfig;
