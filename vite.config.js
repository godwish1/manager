import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 确保动态导入的组件生成可预测的 Chunk 文件
        chunkFileNames: 'js/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('views/')) {
            return 'views';
          }
        }
      }
    }
  },

  server: {
    host: 'localhost',
    port: 8080,

    //增加代理用来访问后端接口
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端接口本地地址
        //target: 'http://106.52.162.188:3000', // 后端接口服务器地址
        changeOrigin: true,
      },
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
  ],

})
