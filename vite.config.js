import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-uks.rplrus.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
