<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form ref="userForm" :model="user" :rules="rules" status-icon @keyup.enter.native="login">
                <div class="login-title">登录</div>
                <el-form-item prop="userName">
                    <el-input type="text" v-model="user.userName" placeholder="请输入用户名" clearable>
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <el-input type="password" v-model="user.userPwd" placeholder="请输入密码" clearable>
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-login" type="primary" @click="login">登 录</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>


<script>
import router from '@/router/index' //引入动态路由
//options API 选项式API方法跳转 (vue2)
export default {
    // 定义组件的名称为 "Login"
    name: "Login",
    data(){
        return {
            user:{
                userName:'awzbox',
                userPwd:'123456'
            },
            rules:{
                userName:[
                    {required:true, message:'请输入用户名', trigger:'blur'}
                ],
                userPwd:[
                    {required:true, message:'请输入密码', trigger:'blur'},
                    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
                ]
            }
        }
    },
    // mounted() {
    //     this.$request.get('/login', { name: 'jack' }, { mock: true, loading: true }).then(res => {
    //         console.log(res)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // },

    methods: {
        login(){
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.$api.login(this.user).then(res => {
                        this.$store.commit('saveUserInfo', res); //保存用户信息到localStorage
                        // 登录成功后强制加载动态路由
                        router.loadAsyncRoutes().then(() => {
                            this.$router.push('/welcome'); // 跳转到欢迎页
                        });
                        ElMessage.success(res.msg || '登录成功');//添加成功提示
                    })
                   
                } else {
                    ElMessage.error(res.msg || '登录失败');
                    return false;
                }
            });

        },

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
