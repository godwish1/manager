import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; //index.js可以省略
//import ElementPlus from 'element-plus'
//import 'element-plus/dist/index.css'
import request from './utils/request';
import storage from './utils/storage';
import elementIcon from "./plugins/icons" //引入element-plus的图标
import api from './api';
import store from './store';

console.log('环境变量= ',import.meta.env);

const app = createApp(App);
app.config.globalProperties.$request = request; //全局挂载request方法
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
//通过use方法把router对象挂载到app实例上，后面组件可以通过this.$router访问
app.use(router).use(store).use(elementIcon).mount('#app')
