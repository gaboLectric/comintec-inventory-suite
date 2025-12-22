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
