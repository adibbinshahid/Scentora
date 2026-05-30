import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bundle the SQLite file into Vercel serverless function output
  outputFileTracingIncludes: {
    "/**": ["../../packages/db/prisma/dev.db"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
