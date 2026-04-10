import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@eventkit/db",
    "@eventkit/lib",
    "@eventkit/ui",
    "@eventkit/types",
    "@eventkit/emails",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
};

export default nextConfig;
