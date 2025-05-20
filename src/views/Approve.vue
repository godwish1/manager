<template>
    <div class="user-manager">
        <div class="query-form">
            <el-form ref="formRef" :inline="true" :model="queryForm">
                <el-form-item label="审批状态" prop="applyState">
                    <el-select v-model="queryForm.applyState" placeholder="全部" clearable>
                        <el-option value="" label="全部" />
                        <el-option :value="1" label="待审批" />
                        <el-option :value="2" label="审批中" />
                        <el-option :value="3" label="审批拒绝" />
                        <el-option :value="4" label="审批通过" />
                        <el-option :value="5" label="作废" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查 询</el-button>
                    <el-button @click="handleReset('formRef')">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="base-table">
            <!-- el-table-column中用prop属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。可以使用 width 属性来定义列宽。 -->
            <el-table :data="applyList">
                <el-table-column type="selection" width="55" />
                <!-- 循环插入数据 -->
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" :formatter="item.formatter" />

                <!-- 自定义列 -->
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <!-- 审核按钮显示条件 -->
                        <el-button v-if="[1,2].includes(scope.row.applyState) && scope.row.curAuditUserName == userInfo.userName"
                         @click="handleDetail(scope.row)">审 核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>

        <!-- 申请详情弹窗 -->
        <el-dialog title="审核" v-model="showDetailModal" width="50%" destroy-on-close >
            <el-form :model="auditForm" ref="dialogForm" label-width="100px" label-suffix=":" :rules="rules">
                <el-form-item label="申请人">
                    <div>{{ detail.applyUser.userName }}</div>
                </el-form-item>
                <el-form-item label="休假类型">
                    <div>{{ detail.applyTypeName }}</div>
                </el-form-item>
                <el-form-item label="休假时间">
                    {{ detail.startTime }} 至 {{ detail.endTime }}
                </el-form-item>
                <el-form-item label="休假时长">
                    {{ detail.leaveTime }}
                </el-form-item>
                <el-form-item label="休假原因">
                    {{ detail.reasons }}
                </el-form-item>
                <el-form-item label="审批状态">
                    {{ detail.applyStateName }}
                </el-form-item>
                <el-form-item label="审批人">
                    {{ detail.curAuditUserName }}
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :rows="4" v-model="auditForm.remark" placeholder="请输入审核备注"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleApprove('refuse')">驳 回</el-button>
                    <el-button type="primary" @click="handleApprove('pass')">审核通过</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>


<script>
import { getCurrentInstance, h, onMounted, reactive, ref, toRaw } from 'vue'
import utils from '../utils/utils';
import { ElMessage } from 'element-plus';

export default {
    name: "approve",
    setup() {
        //ref和reactive创建响应式对象
        // 获取composition API 上下文对象
        // 正确获取全局 $api || 区别于home中可以通过this.$api获取
        const { proxy } = getCurrentInstance();

        const queryForm = reactive({
            applyState: 1, // 审批状态
        });
        //申请列表
        const applyList = ref([]); //涉及到赋值用ref进行定义

        // 申请休假弹窗表单
        const leaveForm = reactive({
            applyType: 1, // 休假类型
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            leaveTime: "0天", // 休假时长
            reasons: "", // 休假原因
        });

        const showDetailModal = ref(false); // 休假详情弹窗
        const userInfo = proxy.$store.state.userInfo; // 获取当前登录用户
        const auditForm = reactive({
            remark: "", // 审核备注
        });

        // 休假详情
        const detail = reactive({});

        // 表单验证规则
        // 这里的rules是一个对象，包含了每个表单项的验证规则
        const rules = reactive({
            remark: [
                { required: true, message: '请输入审核备注', trigger: 'change' },
            ]
        })

        const pager = reactive({
            pageNum: 1,
            pageSize: 10,
            total: 0
        });

        // 定义动态表格--格式
        const columns = reactive([
            {
                label: '单号',
                prop: 'orderNo',

            },
            {
                label: '申请人',
                prop: 'applyUserName',
                formatter(row) {
                    return row.applyUser.userName;
                }

            },
            {
                label: '休假时间',
                prop: 'startTime',
                formatter(row) {
                    return (utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd')
                        + '至' + utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
                    );
                }

            },
            {
                label: '休假时长',
                prop: 'leaveTime',

            },
            {
                label: '休假类型',
                prop: 'applyType',

                formatter(row, column, value) {
                    return {
                        1: '事假',
                        2: '调休',
                        3: '年假'
                    }[value];
                }
            },
            {
                label: '休假原因',
                prop: 'reasons',
            },
            {
                label: '申请时间',
                prop: 'createTime',

                formatter(row, column, value) {
                    return utils.formateDate(new Date(value));
                }
            },
            {
                label: '审批人',
                prop: 'auditUsers',
            },
            {
                label: '当前审批人',
                prop: 'curAuditUserName',
            },
            {
                label: '审批状态',
                prop: 'applyState',

                formatter(row, column, value) {
                    // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
                    return {
                        1: '待审批',
                        2: '审批中',
                        3: '审批拒绝',
                        4: '审批通过',
                        5: '作废'
                    }[value]; // ✅ 通过 value 索引获取字符串;
                }
            },
        ]);

        //初始化接口调用
        onMounted(() => {
            getApplyList(); // 调用获取数据的方法
        });
        const getApplyList = async () => {
            let params = { ...queryForm, ...pager, type:'approve' };
            try {
                const { list, page } = await proxy.$api.getApplyList(params); //params作为参数传送到后端
                applyList.value = list; // ref对象需要通过value属性赋值
                pager.total = page.total;
            } catch (error) {
                console.error('请求出错', error) // 添加错误日志
            }
        };

        // 查询按钮事件
        const handleQuery = () => {
            pager.pageNum = 1; // 重置页码为1
            getApplyList(); // 调用获取数据的方法
        };

        // 重置查询表单
        const handleReset = (form) => {
            proxy.$refs[form].resetFields();
            console.log('重置表单', form); // 添加日志输出
        };

        // 审核按钮事件
        const handleDetail = (row) => {
            showDetailModal.value = true; // 显示详情弹窗
            let data = { ...row };
            detail.applyUser = data.applyUser; // 设置申请人信息
            detail.applyTypeName = {
                1: '事假',
                2: '调休',
                3: '年假'
            }[data.applyType]; // 设置休假类型名称
            detail.startTime = utils.formateDate(new Date(data.startTime), 'yyyy-MM-dd'); // 格式化开始时间
            detail.endTime = utils.formateDate(new Date(data.endTime), 'yyyy-MM-dd'); // 格式化结束时间
            detail.leaveTime = data.leaveTime; // 设置休假时长
            detail.reasons = data.reasons; // 设置休假原因
            detail.applyStateName = {
                1: '待审批',
                2: '审批中',
                3: '审批拒绝',
                4: '审批通过',
                5: '作废'
            }[data.applyState]; // 设置审批状态名称
            detail.curAuditUserName = data.curAuditUserName; // 设置当前审批人名称
            detail._id = data._id; // 设置申请ID
        };
        
        // 审核通过或驳回
        const handleApprove = (action) => {
            proxy.$refs.dialogForm.validate( async (valid) => {
                if (valid) {
                    let params = {
                        action,
                        _id: detail._id, // 申请ID
                        remark: auditForm.remark // 审核备注
                    };
                    try {
                       let res = await proxy.$api.leaveApprove(params)
                       if (res){
                            ElMessage.success('处理成功！'); // 提示操作成功
                            showDetailModal.value = false; // 关闭弹窗
                            handleReset('dialogForm'); // 重置表单
                            auditForm.remark = ""; // 清空审核备注
                            getApplyList(); // 刷新列表
                            proxy.$store.commit("saveNoticeCount", proxy.$store.state.noticeCount-1);// 更新通知数量
                       }
                    }catch (error) {
                        console.error('请求出错', error) // 添加错误日志
                    }
                }
            });

        };

        // 分页器切换事件
        const handleCurrentChange = (pageNum) => {
            pager.pageNum = pageNum;
            getApplyList();
        };

        return {
            queryForm,
            pager,
            columns,
            applyList,
            leaveForm,
            showDetailModal,
            rules,
            userInfo,
            auditForm,
            detail,

            getApplyList,
            handleReset,
            handleCurrentChange,
            handleDetail,
            handleQuery,
            handleApprove,
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