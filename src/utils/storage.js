/**
 * @author kaituo
 * 操作浏览器本地存储（localStorage）的工具函数 
 */
import config from "../config";

export default {
    setItem(key, value) {
        let storage = this.getStorage(); // 获取命名空间下的整个存储对象
        storage[key] = value;            // 更新指定键值
        
        try {
            window.localStorage.setItem(config.namespace, JSON.stringify(storage));
        } catch (e) {
            console.error('存储失败:', e);
        }
    },
    getItem(key) {
        return this.getStorage()[key]; //获取key的值
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    },
    removeItem(key) {
        let storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clearAll() {
        window.localStorage.removeItem(config.namespace);
    }
}