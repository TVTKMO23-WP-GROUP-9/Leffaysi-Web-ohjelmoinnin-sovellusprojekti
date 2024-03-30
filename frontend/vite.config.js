import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@content': path.resolve(__dirname, 'src/content'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@functions': path.resolve(__dirname, 'src/functions')
    }
  }
})
