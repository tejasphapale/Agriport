import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(), // MUST be first!
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Agri Transport Manager',
        short_name: 'AgriTrans',
        theme_color: '#2e7d32',
        background_color: '#f1f8e9',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // explicitly match files
      }
    })
  ]
})
