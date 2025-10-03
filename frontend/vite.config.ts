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
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'cga.pktech.ai',
      'localhost',
      '.pktech.ai'
    ],
    // Em desenvolvimento local, o proxy é NECESSÁRIO.
    // Descomentei e corrigi o target para você.
    proxy: {
      '/api': {
        // MUDE de 'localhost' para o nome do serviço do backend no Docker
        target: 'http://backend:3333',
        changeOrigin: true,
      }
    }
  },
})