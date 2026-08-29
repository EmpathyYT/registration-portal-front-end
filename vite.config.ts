import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://ai-service-production-43ee.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
