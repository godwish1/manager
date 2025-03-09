import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; //index.js可以省略
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axois from 'axios'
import config from './config';

console.log('环境变量= ',import.meta.env);

const app = createApp(App);

axois.get(config.mockApi+'/login').then((res)=>{
    console.log(res);
    
})
//通过use方法把router对象挂载到app实例上，后面组件可以通过this.$router访问
app.use(router).use(ElementPlus).mount('#app')
