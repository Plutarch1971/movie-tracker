import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'
import path from 'path'

export default defineConfig({
  plugins: [react(), envCompatible()],
  root: './client/src', // Add this to specify source directory
  build: {
    outDir: path.resolve(dirname, 'dist'), // Specify build output directory
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(dirname, 'client/src/index.html') // Specify entry point
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts'
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001/',
        secure: false,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3001/',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
