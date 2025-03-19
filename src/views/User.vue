<template>
    <div class="user-manager">
        <div class="query-form">
            <el-form ref="formRef" :inline="true" :model="userForm">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="userForm.userId" placeholder="请输入用户ID" />
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名称" />
                </el-form-item>
                <el-form-item label="用户状态" prop="state">
                    <el-select v-model="userForm.state" placeholder="Select" clearable>
                        <el-option :value="0" label="所有" />
                        <el-option :value="1" label="在职" />
                        <el-option :value="2" label="离职" />
                        <el-option :value="3" label="试用期" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查 询</el-button>
                    <el-button @click="handleReset('formRef')">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate">新 增</el-button>
                <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
            </div>

            <!-- el-table-column中用prop属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。可以使用 width 属性来定义列宽。 -->
            <el-table :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <!-- 循环插入数据 -->
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" :formatter="item.formatter" />

                <!-- 自定义列 -->
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.row)">编 辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope.row)">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>

        <!-- 定义新增弹窗 通过v-model方式 控制弹窗显示 -->
        <el-dialog title="用户新增" v-model="showModal">
            <el-form ref="dialogForm" :model="user" label-width="100px" :rules="rules">

                <el-form-item label="用户名" prop="userName">
                    <!-- 编辑时候用户名和邮箱不可修改 -->
                    <el-input v-model="user.userName" placeholder="请输入用户名" :disabled="action === 'edit'" />
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">

                    <el-input v-model="user.userEmail" placeholder="请输入邮箱(例如: xxx@xxx.com)"
                        :disabled="action === 'edit'">
                    </el-input>

                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="user.mobile" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="user.job" placeholder="请输入岗位" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="user.state" placeholder="Select" clearable>
                        <el-option :value="1" label="在职" />
                        <el-option :value="2" label="离职" />
                        <el-option :value="3" label="试用期" />
                    </el-select>
                </el-form-item>

                <el-form-item label="系统角色" prop="roleList">
                    <!-- 用户角色下拉框 -->
                    <!-- roleList 是从后端获取的角色列表，通过 v-for 循环渲染选项。 -->
                    <el-select v-model="user.roleList" placeholder="选择用户系统角色" multiple style="width: 100%;">
                        <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id" />
                    </el-select>
                </el-form-item>
                <!-- options="deptList"：数据源为 deptList（需为树形结构）。
                 props 配置：checkStrictly: true：允许非严格选中（可选中间节点）。value: '_id'：指定选项的唯一标识字段。label: 'deptName'：指定显示的部门名称字段。 -->
                <el-form-item label="部门" prop="deptId">
                    <el-cascader v-model="user.deptId" placeholder="请选择所属部门" :options="deptList"
                        :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable
                        style="width: 100%;">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose('dialogForm')">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
//import { ElMessage } from 'element-plus'; // 引入 ElMessage
import utils from '../utils/utils';

export default {
    name: "user",
    setup() {
        // 获取composition API 上下文对象
        // 正确获取全局 $api || 区别于home中可以通过this.$api获取
        let { proxy } = getCurrentInstance();


        //ref和reactive创建响应式对象

        //初始化用户表单对象
        const userForm = reactive({
            state: 1
        });
        //初始化用户列表
        const userList = ref([]);
        //分页器
        const pager = reactive({
            pageNum: 1,
            pageSize: 10
        });
        //选中的用户列表对象
        const checkedUserIds = ref([]);

        //弹窗显示
        const showModal = ref(false);

        //新增用户对象
        const user = reactive({
            state: 3
        });

        //角色列表
        const roleList = ref([]);
        //部门列表
        const deptList = ref([]);

        // 定义用户操作行为
        const action = ref('add');

        //表单验证规则
        const rules = reactive({
            userName: [
                { required: true, message: '请输入用户名', trigger: 'blur' },  //添加正则
            ],
            userEmail: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                {
                    pattern:  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/, 
                    message: '邮箱格式不正确(例如: name@example.com)',
                    trigger: 'blur'
                }

            ],
            mobile: [
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
            ],
            deptId: [
                { required: true, message: '请选择所属部门', trigger: 'blur' },
            ],
        })

        // 定义动态表格--格式
        const columns = reactive([
            {
                label: '用户ID',
                prop: 'userId',

            },
            {
                label: '用户名称',
                prop: 'userName',

            },
            {
                label: '用户邮箱',
                prop: 'userEmail',

            },
            {
                label: '用户角色',
                prop: 'role',

                formatter(row, column, value) {
                    return {
                        0: '管理员',
                        1: '普通用户'
                    }[value];
                }
            },
            {
                label: '用户状态',
                prop: 'state',

                formatter(row, column, value) {
                    return {
                        1: '在职',
                        2: '离职',
                        3: '试用期',
                    }[value];
                }
            },
            {
                label: '注册时间',
                prop: 'createTime',

                formatter(row, column, value) {
                    return utils.formateDate(new Date(value));
                }
            },
            {
                label: '最后登录时间',
                prop: 'lastLoginTime',

                formatter(row, column, value) {
                    return utils.formateDate(new Date(value));
                }
            },
        ]);

        //初始化接口调用
        onMounted(() => {
            getUserList();
            getDeptList();
            getRoleAllList();
        });

        // 获取用户列表
        const getUserList = async () => {
            let params = { ...userForm, ...pager };
            try {
                const { list, page } = await proxy.$api.getUserList(params); //params作为参数传送到后端
                userList.value = list; // ref对象需要通过value属性赋值
                pager.total = page.total;
            } catch (error) {
                console.error('请求出错', error) // 添加错误日志
            }

        };
        // 查询事件，获取用户列表
        const handleQuery = () => {
            getUserList();
        };
        // 重置查询表单
        const handleReset = (form) => {
            proxy.$refs[form].resetFields(); // 重置表单  上面一定要配置prop
        };
        // 分页器切换事件
        const handleCurrentChange = (pageNum) => {
            pager.pageNum = pageNum;
            getUserList();
        };
        // 删除单个用户
        const handleDelete = async (row) => {
            await proxy.$api.userDel({ userIds: row.userId }) //可单个删除，也可以多个删除
            ElMessage.success('删除成功');
            getUserList();
        };
        // 批量删除用户
        const handlePatchDel = async () => {
            if (!checkedUserIds.value.length) {
                return ElMessage.error('请选择要删除的用户');
            }
            const res = await proxy.$api.userDel({ userIds: checkedUserIds.value });

            if (res.modifiedCount > 0) {
                ElMessage.success('删除成功');
                getUserList();
            } else {
                ElMessage.error('删除失败');
            }

        };
        //表格多选
        const handleSelectionChange = (selection) => {
            checkedUserIds.value = selection.map(item => item.userId); //等价function(item) { return item.userId; }
        };

        //用户新增
        const handleCreate = () => {
            action.value = 'add';
            showModal.value = true;
        };

        const getDeptList = async () => {
            let list = await proxy.$api.getDeptList();
            deptList.value = list;

        };

        const getRoleAllList = async () => {
            let list = await proxy.$api.getRoleAllList();
            roleList.value = list;
        };
        // 新增用户弹窗的关闭
        const handleClose = () => {
            showModal.value = false; // 弹窗属性设置为false
            handleReset("dialogForm"); // 调用上面函数重置表单
        };
        // 用户弹窗的提交
        const handleSubmit = () => {
            proxy.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    let params = toRaw(user); // 获取表单数据
                    //params.userEmail += '@qq.com';
                    params.action = action.value;
                    let res = await proxy.$api.userSubmit(params);
                    showModal.value = false;
                    ElMessage.success('用户创建成功');
                    handleReset("dialogForm");
                    getUserList();

                }
            });
        };

        //用户编辑
        const handleEdit = (row) => {
            action.value = 'edit';
            showModal.value = true;
            proxy.$nextTick(() => {
                Object.assign(user, row);
            });
        };

        return {
            userForm,
            userList,
            checkedUserIds,
            columns,
            showModal,
            user,
            rules,
            roleList,
            deptList,
            action,

            getUserList,
            pager,
            handleQuery,
            handleReset,
            handleCurrentChange,
            handleDelete,
            handlePatchDel,
            handleSelectionChange,
            handleCreate,
            getDeptList,
            getRoleAllList,
            handleClose,
            handleSubmit,
            handleEdit,

        }
    }
}
</script>

<style lang="scss">
.el-form {
    .el-form-item {
        .el-select {
            width: 200px;
        }
    }
}
</style>