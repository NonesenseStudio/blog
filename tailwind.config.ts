/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#FFFFFF",
          dark: "#101014",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用预加载样式以避免与 Naive UI 冲突
  },
};
