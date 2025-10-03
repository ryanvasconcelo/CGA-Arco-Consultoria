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
    // Proxy não é necessário em produção pois o Traefik roteia as requisições
    // Em desenvolvimento local, descomente e ajuste se necessário:
    // proxy: {
    //   '/api': {
    //     target: 'http://backend:3333',
    //     changeOrigin: true,
    //   }
    // }
  },
})