import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['swiper/react', 'swiper/modules']
  },
  build: {
    outDir: '../backend/frontend/dist', 
  },
});