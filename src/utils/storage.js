/**
 * @author kaituo
 */
import config from "../config";

export default {
    setItem(key, value){
        let storage = this.getStorage();
        storage[key] = value; //添加key的值
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    getItem(key){
        return this.getStorage()[key];
    },
    getStorage(){
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    },
    removeItem(key){
        let storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clearAll(){
        window.localStorage.removeItem(config.namespace);
    }
}