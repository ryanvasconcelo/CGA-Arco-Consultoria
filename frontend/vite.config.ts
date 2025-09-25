import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// const { lovableTagger } = require("lovable-tagger");

export default defineConfig({
  plugins: [
    // lovableTagger(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})