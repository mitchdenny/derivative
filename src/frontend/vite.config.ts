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
      }
    }
  }
})
