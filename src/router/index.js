import { createRouter,createWebHashHistory } from "vue-router";
import Home from "@/components/Home.vue"; 
import storage from "@/utils/storage";
import utils from "@/utils/utils";
import API from "@/api/index";

const routes = [
    {
        name:"home",
        path:"/",
        //定义标题，跳转显示
        meta:{
            title:"首页"
        },
        component:Home,
        redirect:"/welcome",
        
        children:[
            {
                name:"welcome",
                path:"/welcome",
                meta:{
                    title:"欢迎页"
                },
                component:()=>import("@/views/Welcome.vue"), //懒加载
            },
            {
                name:"user",
                path:"/system/user",
                meta:{
                    title:"用户管理"
                },
                component:()=>import("@/views/User.vue") //懒加载
            },
            {
                name:"menuView",
                path:"/system/menu",
                meta:{
                    title:"菜单管理"
                },
                component:()=>import("@/views/Menu.vue") //懒加载
            },
            {
                name:"role",
                path:"/system/role",
                meta:{
                    title:"角色管理"
                },
                component:()=>import("@/views/Role.vue") //懒加载
            },
            {
                name:"dept",
                path:"/system/dept",
                meta:{
                    title:"角色管理"
                },
                component:()=>import("@/views/Dept.vue") //懒加载
            },

      
        ]
    },
    {
        name:"login",
        path:"/login",
        meta:{
            title:"登录"
        },
        component:()=>import("@/views/Login.vue")
    },
    {
        name:"404",
        path:"/404",
        meta:{
            title:"页面不存在"
        },
        component:()=>import("@/views/404.vue")
    }
]
//创建路由对象
const router = createRouter({
    history:createWebHashHistory(),
    routes
})
// 动态加载路由
async function loadAsyncRoutes() {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
        try {
            const { menuList } = await API.getPermissionList()
            // 将菜单数据转换为路由配置
            let routes = utils.generateRoute(menuList)
            console.log('routes: ',routes);
            
            routes.map(route => {
                let url = `./../views/${route.component}.vue`
                route.component = () => import(url);
                router.addRoute("home", route); // 动态添加路由到路由表
            })
        } catch (error) {
            console.log('error: ',error);
        }
    }
}
await loadAsyncRoutes();
// 判断当前地址是否可以访问
/*
function checkPermission(path) {
    let hasPermission = router.getRoutes().filter(route => route.path == path).length;
    if (hasPermission) {
        return true;
    } else {
        return false;
    }
}
*/

// 导航守卫
router.beforeEach((to, from, next) => {
    if (router.hasRoute(to.name)) {
        document.title = to.meta.title;// 设置页面标题
        next()// 允许访问
    } else {
        next('/404')// 路由不存在则跳转404
    }
})

export default router;