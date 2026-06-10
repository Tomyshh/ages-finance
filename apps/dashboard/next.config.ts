import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The shared package ships as ESM from its dist build.
  transpilePackages: ["@agec/shared"],
};

export default nextConfig;
