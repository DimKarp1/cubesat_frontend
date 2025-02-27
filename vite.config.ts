import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import {host, http} from './src/api'
import mkcert from 'vite-plugin-mkcert'
import fs from "node:fs";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: !http ? "/cubesat" : "/",
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: `http://${host}:8000`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    https: !http ? {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    } : undefined,
  },
  plugins: [react(),
    !http && mkcert(),
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
