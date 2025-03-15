/**
 * api接口的统一出口
 */
import request from "../utils/request"
export default {
    login(params){
        return request({
            url:"/users/login",
            method:"post",
            data:params, //这里还是调用后端接口
        })
    },

    noticeCount(params){
        return request({
            url:"/leave/count",
            method:"get",
            data:{},
            mock:true //单独走mock
        })
    },

    getMenuList(){
        return request({
            url:"/menu/list",
            method:"get",
            data:{},
            mock:true
        })
    },
    getUserList(params){
        return request({
            url:"/users/list",
            method:"get",
            data: params,
        })
    },
    userDel(params){
        return request({
            url:"/users/delete",
            method:"post",
            data: params,
        })
    },
    getRoleList(){
        return request({
            url:"/roles/alllist",
            method:"get",
            data:{},
            mock:true
        })
    },
    getDeptList(){
        return request({
            url:"/dept/list",
            method:"get",
            data:{},
            mock:true
        })
    },
    userSubmit(params){
        return request({
            url:"/users/operate",
            method:"post",
            data:params,
        })
    }
}