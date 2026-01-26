import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'], // allow GitHub avatars
  },
};

export default nextConfig;
