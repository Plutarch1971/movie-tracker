import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), envCompatible()],
   build: {
    rollupOptions:{
      output: {
        manualChunks:{
          'react-vendor': ['react', 'react-dom'],
          'apollo-client': ['@apollo/client'],
          //Add other large dependencies here
        },
      },
    },
    chunkSizeWarningLimit: 1000, //Adjust the chunk size warning limit if needed
   },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/_tests_/setup.ts'
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      },
      '/our-api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
