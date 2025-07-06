import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly set the project root
  root: __dirname,
  build: {
    // And the output directory, relative to the root
    outDir: './dist',
  },
})
