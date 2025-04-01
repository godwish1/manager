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
import mitt from 'mitt';

console.log('环境变量= ',import.meta.env);

const app = createApp(App);

// 自定义指令:按钮权限控制功能  模板中用法: v-has="'user-create'"
app.directive('has', {
    beforeMount: function (el, binding) {
        //获取权限按钮
        let actionList = storage.getItem('actionList');
        let value = binding.value;
        //盘点列表中是否有对应按钮权限标识
        let hasPermission = actionList.includes(value);
        if(!hasPermission){
            //隐藏
            el.style.display = 'none';
            //宏任务，移除节点
            setTimeout(()=>{
                el.parentNode.removeChild(el);
            },0)
        }
    }
})

app.config.globalProperties.$request = request; //全局挂载request方法
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
//通过use方法把router对象挂载到app实例上，后面组件可以通过this.$router访问
app.use(router).use(store).use(elementIcon).mount('#app')

// 创建事件总线（使用 mitt）
const emitter = mitt()
export const eventBus = emitter // 直接导出 emitter