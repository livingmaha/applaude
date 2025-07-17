import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Enable sourcemaps only in development
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Create a dedicated chunk for larger libraries
              if (id.includes('@sentry')) {
                return 'sentry';
              }
              // Group core React libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-core';
              }
              // Group other vendor libraries
              return 'vendor';
            }
          },
        },
      },
    },
  }
})
