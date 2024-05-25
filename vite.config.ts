import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";


const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon.ico",
    "apple-touch-icon.png",
    "pwa-64x64.png",
    "pwa-192x192.png",
    "pwa-512x512.png",
    "maskable-icon-512x512.png",
  ],
  manifest: {
    name: "Python Web Editor",
    short_name: "Python Web Editor",
    description: "Python Web Editor - Powered by Vite and React",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
  },
};



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugIn),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/pyodide/*.*",
          dest: "./assets",
        },
      ],
    }),
  ],
  base: "/py-web-editor/",
  optimizeDeps: {
    include: ["@monaco-editor/react"],
    exclude: ["pyodide"],
  },

  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
      // pyodide: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js",
    },
  },
});
