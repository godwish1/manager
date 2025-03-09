/**
 * 环境配置封装
 * 项目级别的地址配置都放到config这里
 */
const env = import.meta.env.MODE || "prod";
const Envconfig = {
    dev:{
        baseApi:"/",
        mockApi:"http://localhost:7300/mock/67cd191cfd530800271a9ec4/api"
    },
    test:{
        baseApi:"//test.futurefe.com/api",
        mockApi:"http://localhost:7300/mock/67cd191cfd530800271a9ec4/api"
    },
    prod:{
        baseApi:"//futurefe.com/api",
        mockApi:"http://localhost:7300/mock/67cd191cfd530800271a9ec4/api"
    },
}

export default {
    namespace:"manager",
    env,
    mock:true,
    ...Envconfig[env]
    // 展开运算符 ...Envconfig[env] 会将这个对象的属性展开并合并到导出的对象中。
    // (既包含baseApi又包含mockApi)
}