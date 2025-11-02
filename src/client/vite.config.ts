import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': {
        target: process.env.BACKEND_HTTPS,
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: process.env.BACKEND_HTTPS?.replace('https', 'wss') || 'ws://localhost:5000',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
