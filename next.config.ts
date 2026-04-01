import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "**" }, // Allow all external images (for og:image, article images)
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: process.env.NODE_ENV === "production" 
          ? "https://web-production-b32de.up.railway.app/:path*"
          : "http://localhost:8000/:path*", // Local development
      },
    ];
  },
};

export default nextConfig;
