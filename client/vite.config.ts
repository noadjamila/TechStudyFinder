import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [],
      manifest: {
        name: "Tech Study Finder",
        short_name: "Study Finder",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#007bff",
        icons: [],
      },
    }),
  ],
});
