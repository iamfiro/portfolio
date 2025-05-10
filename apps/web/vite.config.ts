import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@util': path.resolve(__dirname, '../../packages/util/src')
    }
  }
})
