/**
 * axios 二次封装
 */
import axios from 'axios';
import config from '../config';
import { ElMessage } from 'element-plus';
import router from '../router';
import storage from './storage';

const TOKEN_INVALID = 'Token认证失败, 请重新登录';
const NETWORK_ERROR = '网络请求异常，请稍后重试';

//创建axios实例对象，添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})


//请求拦截器
service.interceptors.request.use((req) => {
    const headers = req.headers;
    const userInfo = storage.getItem('userInfo'); // 获取整个 userInfo 对象
    const token = userInfo?.token; // 使用可选链操作符防止解构错误

    if (token && !headers.Authorization) {
        headers.Authorization = 'Bearer ' + token;
    }
    return req;
});

//响应拦截器
service.interceptors.response.use((res) => {

    const { code, data, msg } = res.data; // 解构响应数据
    //debugger;
    if (code === 200) { // 如果状态码是 200，表示成功
        return data; // 返回数据

    } else if (code === 50001) { // 如果状态码是 50001，表示 Token 失效
        ElMessage.error(TOKEN_INVALID); // 显示 Token 失效的错误消息
        setTimeout(() => {
            router.push('/login'); // 1.5秒后重定向到登录页面
        }, 1500);
        return Promise.reject(TOKEN_INVALID); // 返回一个被拒绝的 Promise，携带错误信息

    } else { // 其他错误
        ElMessage.error(msg || NETWORK_ERROR); // || 用于在 msg 为空或未定义时提供一个默认值
        return Promise.reject(msg || NETWORK_ERROR);
    }
});

/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
    options.method = options.method || "get";
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    let isMock = config.mock;
    if (typeof options.mock != 'undefined') {
        isMock = options.mock;
    }
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi;
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }

    return service(options);//返回一个axios对象
}

// 遍历数组
['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    // 定义请求方法
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request;