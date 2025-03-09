<template>
    <div>
        <h3>欢迎来到登录界面</h3>
        <!-- 这里采用勾子的方式回到主页面 -->
        <el-button @click="goHome">回首页</el-button>
    </div>
</template>
    

<script>
import Welcome from './Welcome.vue'

//options API 选项式API方法跳转 (vue2)
export default {
  components: { Welcome },
    // 定义组件的名称为 "Login"
    name:"Login",

    mounted(){
        // this.$request({
        //     method: 'get',
        //     url: '/login',
        //     data: {
        //         name:'jack'
        //     }
        // }).then(res => {
        //     console.log(res)
        // }).catch(err => {
        //     console.log(err)
        // })
        this.$request.get('/login', {name:'jack'}, {mock:true, loading:true}).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },

    methods:{
        goHome(){// 定义一个名为 goHome 的方法
            this.$router.push('/welcome')
        }
    }
}

//Composition API 组合式API方法跳转
// import { useRouter } from 'vue-router'

// //使用useRouter获取路由对象
// const router = useRouter()
// const goHome = () => {
//     router.push('/welcome')
// }

</script>


<style scoped>

</style>
