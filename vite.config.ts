import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/upsell": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/app": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [tanstackStart({ server: { entry: "server" } }), viteReact(), tailwindcss()],
});
