import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Locally: '/' (for dev server)
  // Production: '/your-wealth/' (repository name on GitHub Pages)
  base: process.env.VITE_GITHUB_PAGES_BASE || (process.env.NODE_ENV === 'production' ? '/your-wealth/' : '/'),
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
