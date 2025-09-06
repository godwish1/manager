<template>
    <div class="welcome">
        <div class="content">
            <div class="sub-title">欢迎体验</div>
            <div class="title">企业通用后台管理系统</div>
            <div class="desc">Vue3+ElementPlus+Node+MongoDB</div>
        </div>
        <div class="img"></div>
       
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


<style scoped lang="scss">
.welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #ffffff;
    
    .content{
        position: relative;
        bottom: 100px;
        
        .sub-title{
            font-size: 30px;
            color: #606266;
            line-height: 42px;
            margin-bottom: 10px;
        }

        .title{
            font-size: 40px;
            color: #1109ac;
            margin-bottom: 10px;
        }

        .desc{
            text-align: right;
            font-size: 20px;
            color: #a5a7ad;
        }
    }

    .img{
        margin-left: 100px;
        width: 371px;
        height: 438px;
        background: url(../assets/images/welcome.png) no-repeat;
        background-size: cover;
    }
}
</style>
