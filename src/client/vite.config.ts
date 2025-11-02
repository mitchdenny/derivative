import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': {
        target: process.env.BACKEND_HTTPS || 'http://localhost:5160',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: (process.env.BACKEND_HTTPS || 'http://localhost:5160').replace('https', 'ws').replace('http', 'ws'),
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
