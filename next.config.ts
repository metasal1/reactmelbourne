import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

// OpenNext Cloudflare dev integration — enables access to Cloudflare
// bindings like KV, D1, R2 during `next dev`. Safe to keep even without bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
