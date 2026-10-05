import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds straight into the Spring Boot app's static resources folder so the
// whole thing ships as a single deployable jar - no separate frontend host,
// no CORS to configure. `npm run dev` still proxies /api to the backend for
// local development.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
