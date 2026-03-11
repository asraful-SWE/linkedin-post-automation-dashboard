import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://web-production-b32de.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
