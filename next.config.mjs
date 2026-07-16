/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Workers has no Next.js image optimizer. Serve images as-is so
    // next/image works everywhere without depending on Cloudflare Images / zone
    // resizing. (The heavy visuals are Three.js textures, not next/image.)
    unoptimized: true,
    qualities: [50, 75],
    remotePatterns: [
      { protocol: "https", hostname: "aceternity.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.microlink.io" },
    ],
  },
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|woff2|glb)/,
      loader: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;

// Enables access to Cloudflare bindings during `next dev` (no-op otherwise).
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
