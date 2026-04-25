import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/categorias': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ingredientes': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/productos': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/usuarios': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/pedidos': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})