import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
   // port: 3000,
    port: 5173,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/our-api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    },
  },
});
