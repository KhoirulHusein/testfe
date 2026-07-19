import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Next menormalisasi trailing slash, padahal backend butuh persis "POST /article/"
      { source: "/api/article", destination: `${BACKEND}/article/` },
      { source: "/api/:path*", destination: `${BACKEND}/:path*` },
    ];
  },
};

export default nextConfig;
