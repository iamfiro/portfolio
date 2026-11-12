import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

import blogOgPlugin from "./vite/blog-og.plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), blogOgPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/shared/styles/variables.scss" as *;`,
      },
    },
  },
});
