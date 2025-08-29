import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

(async () => {
  await initOpenNextCloudflareForDev();
})();
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
