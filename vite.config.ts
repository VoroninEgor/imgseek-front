import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shop': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      },
      '/search': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      },
      '/api/callback': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
