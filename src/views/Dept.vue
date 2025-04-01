<template>
    <div class="dept-manage">
        <div class="query-form">
            <el-form :inline="true" ref="form" :model="queryForm">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDeptList">查 询</el-button>
                    <el-button @click="handleReset('form')">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleOpen" v-has="'dept-create'">创 建</el-button>
            </div>
            <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
                <el-table-column v-for="item in columns" :key="item.prop" v-bind="item"
                    :formatter="item.formatter"></el-table-column>

                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" @click="handleEdit(scope.row)" v-has="'dept-edit'">编辑</el-button>
                        <el-button type="danger" @click="handleDel(scope.row._id)" v-has="'dept-delete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="action == 'create' ? '部门创建' : '编辑部门'" v-model="showModal" :close-on-click-modal="false"
            :show-close="false" width="50%">
            <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="100px">

                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader placeholder="请选择上级部门" v-model="deptForm.parentId"
                        :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" :options="deptList"
                        :show-all-levels="true" clearable>
                    </el-cascader>
                </el-form-item>

                <el-form-item label="部门名称" prop="deptName">
                    <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
                </el-form-item>

                <el-form-item label="负责人" prop="user">
                    <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleUser">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="负责人邮箱" prop="userEmail">
                    <el-input v-model="deptForm.userEmail" disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>

            </template>
        </el-dialog>
    </div>
</template>


<script>
import utils from '@/utils/utils.js';
export default {
    name: 'Dept',
    data() {
        return {
            queryForm: {
                deptName: ''
            },
            deptForm: {
                parentId:[null]
            },
            deptList: [],
            userList: [],

            action: '',
            showModal: false,
            columns: [
                {
                    label: '部门名称',
                    prop: 'deptName',
                    
                },
                {
                    label: '负责人',
                    prop: 'userName',
                    
                },
                {
                    label: '更新时间',
                    prop: 'updateTime',
                   
                      formatter(row, column, value) {
                        return utils.formateDate(new Date(value)); //new一个Date对象,然后把时间戳传进去 
                      },
                },
                {
                    label: '创建时间',
                    prop: 'createTime',
                   
                      formatter(row, column, value) {
                        return utils.formateDate(new Date(value)); //new一个Date对象,然后把时间戳传进去 
                      },
                },

            ],
            rules: {
                parentId: [
                    { required: true, message: '请选择上级部门', trigger: 'blur' }
                ],
                deptName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                user: [
                    { required: true, message: '请选择部门负责人', trigger: 'change' }
                ],
            }
        }
    },
    mounted() {
        this.getDeptList();
        this.getAllUserList();
    },
    methods: {
        async getDeptList() {
            try {
                let list = await this.$api.getDeptList({ ...this.queryForm});
                this.deptList = list;

            } catch (e) {
                throw new Error(e);
            }
        },
        async getAllUserList() {
            try {
                let list = await this.$api.getAllUserList();
                this.userList = list;
            } catch (e) {
                throw new Error(e);
            }
        },
        handleOpen() {
            this.action = 'create';
            this.showModal = true;
        },
        handleUser(val) {
            const [userId, userName, userEmail] = val.split('/');
            Object.assign(this.deptForm, { userId, userName, userEmail });//浅拷贝
        },
        handleEdit(row) {
            this.action = 'edit';
            this.showModal = true;
            this.$nextTick(() => {
                Object.assign(this.deptForm, row, {user:`${row.userId}/${row.userName}/${row.userEmail}`});
            });
        },
        async handleDel(_id) {
            this.action = 'delete';
            await this.$api.deptOperate({_id, action:this.action});
            this.getDeptList();
            ElMessage.success('删除成功');
        },
        handleReset(form) {
            this.$refs[form].resetFields(); // 通用重置表单方法
        },
        handleClose() {
            this.showModal = false;
            this.handleReset("dialogForm");
        },
        handleSubmit() {
            this.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    let params = { ...this.deptForm, action: this.action }
                    delete params.user;
                    let res = await this.$api.deptOperate(params);
                    if (res) {
                        this.handleClose();
                        this.getDeptList();
                        ElMessage.success('操作成功');
                    }
                }
            })
        },

    }
}
</script>


<style></style>