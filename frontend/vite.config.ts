import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@sentry')) {
              return 'sentry';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})

const dependencies = {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.1",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@hookform/resolvers": "^3.3.4",
  "@mui/material": "^5.15.11",
  "@stripe/react-stripe-js": "^2.5.1",
  "@stripe/stripe-js": "^3.0.6",
  "axios": "^1.6.7",
  "framer-motion": "^11.0.8",
  "i18next": "^23.10.0",
  "i18next-browser-languagedetector": "^7.2.0",
  "i18next-http-backend": "^2.5.0",
  "jwt-decode": "^4.0.0",
  "react-hook-form": "^7.51.0",
  "react-i18next": "^14.0.5",
  "react-icons": "^5.0.1",
  "react-slick": "^0.30.2",
  "slick-carousel": "^1.8.1",
  "sonner": "^1.4.2",
  "zod": "^3.22.4",
  "zustand": "^4.5.2"
};
