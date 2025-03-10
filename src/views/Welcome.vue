<template>
    <div>
        <h3>欢迎来到主页面-{{ msg }}</h3>
        <!-- 这里采用router-link方式跳转到登录页面 -->
        <router-link to="/login">去登录</router-link>
    </div>
</template>
    

<script>
export default {
    name:"Welcome",
    props: {
        msg: String
    }
}

</script>


<style scoped>

</style>
