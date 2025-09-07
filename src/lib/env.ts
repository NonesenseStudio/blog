import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getEnv = () => {
  const { env } = getCloudflareContext();
  return env;
};
