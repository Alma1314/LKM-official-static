import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // 纯静态输出：构建产物只含静态 HTML/CSS/JS，不依赖 node adapter
  output: "static",
  site: "http://124.220.55.235",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
