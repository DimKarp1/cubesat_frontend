import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import {VitePWA} from "vite-plugin-pwa";
import fs from 'fs';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  base: "/cubesat",
  server: {
    port: 3000,
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react(),
    mkcert(),
    VitePWA({ registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest:{
        name: "CubeSat",
        short_name: "CubeSat",
        start_url: "/cubesat/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#65A8A4",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/cubesat/CubeSat_icon_manifest.png",
            type: "image/png",
            sizes: "512x512"
          },
        ],
        screenshots: [
          {
            src: "/cubesat/img.png",
            sizes: "389x755",
            type: "image/png"
          }
        ]
      }
    })],
});
