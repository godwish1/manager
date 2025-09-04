/**
 * web worker操作不了Dom，就是优化JS处理
 */

//importScripts('http://localhost:8080/a.js') // 必须是网络地址，可以跨域
import {a1} from 'http://localhost:8080/a.js';
// console.log(a1);
let a = 1
self.postMessage(a);

self.onmessage = function(e) {
  console.log("Message received from main script: ",e.data);
} 