<template>
    <div>1111</div>
    <button @click="worker.postMessage('hello')">发送</button>
</template>

<script setup lang="ts">

let worker = new Worker('http://localhost:8080/test.js',{
    type: 'module',
});

worker.addEventListener('message', (e) => {
    console.log("从webWorker接收到的数据：",e.data);
});

</script>

<style scoped lang="scss">

</style>