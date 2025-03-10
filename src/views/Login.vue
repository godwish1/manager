<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form>
                <div class="login-title">登录</div>
                <el-form-item>
                    <el-input type="text">
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password">
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-login" type="primary" @click="goHome">登录</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>


<script>
import Welcome from './Welcome.vue'
// import { User } from '@element-plus/icons-vue';
//options API 选项式API方法跳转 (vue2)
export default {
    components: { 
        Welcome, 
        
    },
    // 定义组件的名称为 "Login"
    name: "Login",

    mounted() {
        this.$request.get('/login', { name: 'jack' }, { mock: true, loading: true }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },

    methods: {
        goHome() {// 定义一个名为 goHome 的方法
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


<style lang="scss">
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f2f5;
    width: 100vw;
    height: 100vh;

    .modal {
        width: 500px;
        padding: 50px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px 3px rgba(0, 0, 0, .1);

        .login-title {
            font-size: 30px;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 20px;
        }

        .btn-login {
            width: 100%;
            margin-top: 20px;
        }
    }
}
</style>
