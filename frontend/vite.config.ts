import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Escuta em todas as interfaces
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'cga.pktech.ai',
      'localhost',
      '.pktech.ai' // Permite todos os subdomínios
    ],
    // Opcional: configurações de proxy se o backend estiver em outra porta
    proxy: {
      '/api': {
        target: 'http://cga_backend_api:3333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})