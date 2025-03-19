<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in breadList" :key="item.path">
            <router-link to="/welcome" v-if="index===0">{{ item.meta.title}}</router-link>
            <span v-else>{{ item.meta.title}}</span>
        </el-breadcrumb-item>
        
    </el-breadcrumb>

</template>
    

<script>
//通过动态展示当前路由的层级路径（如 首页 > 用户管理 > 编辑），让用户知道当前所处位置。也可以点击路由进行跳转
export default {
    name: "BreadCrumb",
    computed: {
        breadList() {
            return this.$route.matched;
        }
    },
    mounted() {
        console.log("routes=>",this.$route);
            
    },
}
</script>

