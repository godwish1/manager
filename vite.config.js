import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:'localhost',
    port:8080,
    
    //增加代理用来访问后端接口
    // 增加代理用来访问后端接口
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      }
      // '/mock': {
      //   target: 'http://localhost:7300',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/mock/, '')
      // }
    }
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
