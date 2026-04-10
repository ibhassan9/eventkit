import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@eventkit/db",
    "@eventkit/lib",
    "@eventkit/ui",
    "@eventkit/types",
  ],
};

export default nextConfig;
