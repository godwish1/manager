import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/components/Home.vue";
import storage from "@/utils/storage";
import utils from "@/utils/utils";
import API from "@/api/index";

const routes = [
    {
        name: "home",
        path: "/",
        //定义标题，跳转显示
        meta: {
            title: "首页"
        },
        component: Home,
        redirect: "/welcome",

        children: [
            {
                name: "welcome",
                path: "/welcome",
                meta: {
                    title: "欢迎页"
                },
                component: () => import("@/views/Welcome.vue"), //懒加载
            },
        ]
    },
    {
        name: "login",
        path: "/login",
        meta: {
            title: "登录"
        },
        component: () => import("@/views/Login.vue")
    },
    {
        name: "404",
        path: "/404",
        meta: {
            title: "页面不存在"
        },
        component: () => import("@/views/404.vue")
    }
]
//创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes
});


let isRoutesLoaded = false;

async function loadAsyncRoutes() {
    let userInfo = storage.getItem('userInfo') || {};
    if (userInfo.token) {
        try {
            const { menuList } = await API.getPermissionList();
            //console.log('menuList:', menuList);
            let routes = utils.generateRoute(menuList);
            //console.log('routes:', routes);
            routes.forEach(route => {
                let url = `../views/${route.component}.vue`; //不能用@
                route.component = () => import(/* @vite-ignore */ url);
                router.addRoute("home", route);
            });
            isRoutesLoaded = true;
            console.log('动态路由加载完成');
        } catch (error) {
            console.log('动态路由加载失败:', error);
            isRoutesLoaded = true; // 即使失败，也标记为已加载
        }
    } else {
        console.log('未检测到 token,跳过动态路由加载');
        isRoutesLoaded = true; // 关键修改：设置为 true
    }
}

//await loadAsyncRoutes(); // 初始化时加载路由

//全局前置守卫
router.beforeEach(async (to, from, next) => {
    console.log('导航守卫执行:', to.path);
    const userInfo = storage.getItem('userInfo') || {};

    if (!userInfo.token && to.path !== '/login') {
        next('/login');
        return;
    }

    if (to.path === '/login') {
        next();
        return;
    }

    if (!isRoutesLoaded) {
        console.log('正在加载动态路由...');
        await loadAsyncRoutes();
        next({ ...to, replace: true });
        return;
    }

    if (router.hasRoute(to.name)) {
        document.title = to.meta.title;
        next();
    } else {
        next('/404');
    }
});

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

router.loadAsyncRoutes = loadAsyncRoutes;

export default router;