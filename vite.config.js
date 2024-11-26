import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
