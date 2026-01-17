import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true
    })
  ],
  server: {
    host: true, // Доступ с телефона
    port: 5173,
    open: true // Авто-открытие браузера
  },
  build: {
    target: 'es2015', // Поддержка старых браузеров
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'localforage']
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})