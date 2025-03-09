<template>
  <router-view></router-view>
  </template>

<script>
  export default {
    name:"app",
    mounted(){
      this.$storage.setItem("userinfo",{name:'jack',age:18})
      console.log('user=>',this.$storage.getItem("userinfo"));
      // 先获取整个 userinfo 对象
      const userinfo = this.$storage.getItem('userinfo');
      // 删除 name 属性
      delete userinfo.name;
      // 重新存储修改后的对象
      this.$storage.setItem('userinfo', userinfo);
      this.$storage.clearAll()
      
    }
  }


</script>



<style scoped>

</style>
