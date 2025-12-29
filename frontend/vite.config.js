import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Dev-only: when exposing Vite via tunnels (trycloudflare/ngrok), the Host header
    // will be the public tunnel hostname. Allow it so Vite doesn't block requests.
    allowedHosts: true,
    proxy: {
      // Forward PocketBase API + realtime through the same origin.
      '/api': {
        target: 'http://pocketbase:8090',
        changeOrigin: true,
        secure: false,
      },
      // Optional: PocketBase admin UI (handy in dev, also works through the tunnel)
      '/_/': {
        target: 'http://pocketbase:8090',
        changeOrigin: true,
        secure: false,
      },
    },
    https: process.env.VITE_HTTPS === 'true' ? {
      key: fs.readFileSync(path.resolve(__dirname, './ssl/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './ssl/server.crt'))
    } : false,
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
