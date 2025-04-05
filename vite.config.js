import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true
    })
  ],
  server: {
    port: 3005,
  },
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
