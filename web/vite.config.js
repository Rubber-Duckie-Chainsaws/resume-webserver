import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: '/src/main.js'
    }
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        whitespace: 'preserve'
      }
    }
  })],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  server: {
    origin: 'http://10.0.0.68:3000'
  }
})
