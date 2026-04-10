import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@eventkit/ui",
    "@eventkit/lib",
    "@eventkit/types",
  ],
};

export default nextConfig;
