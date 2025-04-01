<template>
    <div class="exception">
        <img src="@/assets/images/404.jpeg" alt="404">
        <el-button class="btn-home" @click="goHome">返回首页</el-button>
    </div>
</template>

<script>
export default {
    name: '404',
    methods: {
        goHome() {
            this.$router.push('/');
        }
    }
}
</script>



<style lang="scss">
.exception {
    img {
        width: 100%;
        height: 100vh;
    }

    .btn-home{
        font-weight: bold;
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%); // 水平居中
    }
}
</style>