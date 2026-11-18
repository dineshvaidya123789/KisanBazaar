import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// GitHub Pages shows its own "404" page for any address that is not a real file (for example /weather or /login).
// It uses a file called 404.html when there is one. Giving it a copy of index.html lets the app open at any direct
// link, also for a visitor who has never opened the site before (added 2026-11-19).
const copyIndexTo404 = () => {
  let outDir = 'dist'
  return {
    name: 'copy-index-to-404',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const from = path.join(outDir, 'index.html')
      if (fs.existsSync(from)) fs.copyFileSync(from, path.join(outDir, '404.html'))
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyIndexTo404(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Kisan Bazaar',
        short_name: 'KisanBazaar',
        description: 'Connecting Farmers and Buyers Directly',
        theme_color: '#4CAF50',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 Year
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
})

