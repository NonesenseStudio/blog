import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev().then((r) => r);
const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm"],
};

export default nextConfig;
