import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  reactCompiler: true,
};

export default nextConfig;
