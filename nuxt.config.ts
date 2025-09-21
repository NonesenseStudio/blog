import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-09-19",
  devtools: { enabled: true },
  modules: ["nuxtjs-naive-ui", "@pinia/nuxt", "@nuxthub/core", "@vueuse/nuxt"],
  css: ["~/assets/styles/global.css"],
  build: {
    transpile: ["naive-ui", "vueuc", "@css-render/vue3-ssr"],
  },
  hub: {
    database: true,
  },
  vite: {
    optimizeDeps: {
      include: ["naive-ui", "vueuc"],
    },
    plugins: [
      tailwindcss(),
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
});
