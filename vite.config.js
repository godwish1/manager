import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:'localhost',
    port:8080
  },
  plugins: [vue()]
})
