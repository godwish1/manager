import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:'localhost',
    port:8080
  },
  plugins: [
    vue(),
    //自动导入element-plus,懒加载
    AutoImport({  
      resolvers: [ElementPlusResolver()]
    }),
    Components({ 
      resolvers: [ElementPlusResolver()]
    })
  ]
})
