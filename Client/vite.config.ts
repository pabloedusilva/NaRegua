import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: '../public',
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@components': path.resolve(process.cwd(), 'src/components'),
      '@pages': path.resolve(process.cwd(), 'src/pages'),
      '@context': path.resolve(process.cwd(), 'src/context'),
      '@hooks': path.resolve(process.cwd(), 'src/hooks'),
      '@utils': path.resolve(process.cwd(), 'src/utils'),
      '@styles': path.resolve(process.cwd(), 'src/styles'),
      '@data': path.resolve(process.cwd(), 'src/data')
    }
  }
})
