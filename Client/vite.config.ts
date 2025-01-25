import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  build: {
    rollupOptions:{
      output: {
        manualChunks:{
          'react-vendor': ['react','react-dom'],
          'apollo-client': ['@apollo/client'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: './src/_tests_/setup.ts'
  // },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error',(err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
          
        }
      },
      '/our-api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    },
  },
});
