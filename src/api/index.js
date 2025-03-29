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

    getMenuList(params){
        return request({
            url:"/menu/list",
            method:"get",
            data:params,
        })
    },
    menuSubmit(params){
        return request({
            url:"/menu/operate",
            method:"post",
            data:params,
        })
    },
    getUserList(params){
        return request({
            url:"/users/list",
            method:"get",
            data: params,
        })
    },
    getAllUserList(){
        return request({
            url:"/users/all/list",
            method:"get",
            data: {},
        })
    },
    userDel(params){
        return request({
            url:"/users/delete",
            method:"post",
            data: params,
        })
    },
    userSubmit(params){
        return request({
            url:"/users/operate",
            method:"post",
            data:params,
        })
    },

    getRoleAllList(){
        return request({
            url:"/roles/alllist",
            method:"get",
            data:{},
            mock:false
        })
    },
    getRoleList(params){
        return request({
            url:"/roles/list",
            method:"get",
            data:params,

        })
    },
    roleOperate(params){
        return request({
            url:"/roles/operate",
            method:"post",
            data:params,
        })
    },
    roleUpdatePermission(params){
        return request({
            url:"roles/update/permission",
            method:"post",
            data:params,
        })
    },
    //部门列表
    getDeptList(params){
        return request({
            url:"/dept/list",
            method:"get",
            data:params,
        })
    },
    deptOperate(params){
        return request({
            url:"/dept/operate",
            method:"post",
            data:params,
        })
    },


}