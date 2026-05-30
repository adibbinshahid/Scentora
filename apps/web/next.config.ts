import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep db/prisma packages server-side only — never bundled into client JS
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs", "db"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
