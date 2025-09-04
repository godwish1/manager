/**
 * 环境配置封装
 * 项目级别的地址配置都放到config这里
 */
// const env = import.meta.env.NODE_ENV || "prod";
const env = import.meta.env.VITE_APP_ENV || 'prod'; 
// const baseApi = import.meta.env.VITE_APP_API_URL || "/api";

const Envconfig = {
    dev:{
        baseApi:"/api",
        mockApi:"http://localhost:7300/mock/67fa2eed1d004a002ca4039b/api"
    },
    test:{
        baseApi:"//test.futurefe.com/api",
        mockApi:"http://localhost:7300/mock/67cff7be1c230d00279eec08/api"
    },
    prod:{
        baseApi: "/api",
        mockApi:"http://localhost:7300/mock/67cff7be1c230d00279eec08/api"
    },
}

export default {
    namespace:"manager",
    env,
    mock:false,
    ...Envconfig[env]
    // 展开运算符 ...Envconfig[env] 会将这个对象的属性展开并合并到导出的对象中。
    // (既包含baseApi又包含mockApi)
}