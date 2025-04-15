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
            <div class="action">
                <el-button type="primary" @click="handleApply">申请休假</el-button>
            </div>

            <!-- el-table-column中用prop属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。可以使用 width 属性来定义列宽。 -->
            <el-table :data="applyList">
                <el-table-column type="selection" width="55" />
                <!-- 循环插入数据 -->
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" :formatter="item.formatter" />

                <!-- 自定义列 -->
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button @click="handleDetail(scope.row)">查 看</el-button>
                        <el-button type="danger" v-if="[1, 2].includes(scope.row.applyState)"
                            @click="handleDelete(scope.row)">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>

        <el-dialog title="申请休假" v-model="showModal" width="70%">
            <el-form ref="dialogForm" :model="leaveForm" label-width="100px" :rules="rules">
                <el-form-item label="休假类型" prop="applyType">
                    <el-select v-model="leaveForm.applyType" placeholder="Select" clearable>
                        <el-option :value="1" label="事假" />
                        <el-option :value="2" label="调休" />
                        <el-option :value="3" label="年假" />
                    </el-select>
                </el-form-item>
                <el-form-item label="休假时间">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="startTime">
                                <el-date-picker v-model="leaveForm.startTime" type="date" placeholder="选择开始日期"
                                    style="width: 100%;"
                                    @change="(val) => handleDateChange('startTime', val)"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">至</el-col>
                        <el-col :span="10">
                            <el-form-item prop="endTime">
                                <el-date-picker v-model="leaveForm.endTime" type="date" placeholder="选择结束日期"
                                    style="width: 100%;"
                                    @change="(val) => handleDateChange('endTime', val)"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="休假时长" prop="leaveTime" required>
                    {{ leaveForm.leaveTime }}
                </el-form-item>
                <el-form-item label="休假原因" prop="reasons">
                    <el-input type="textarea" :row="5" v-model="leaveForm.reasons" placeholder="请输入休假原因" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose('dialogForm')">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog title="休假详情" v-model="showDetailModal" width="50%" destroy-on-close>
            <el-steps align-center :active="active" finish-status="success">
                <el-step title="待审批" />
                <el-step title="审批中" />
                <el-step title="审批通过/拒绝" />
            </el-steps>
            <el-form label-width="100px" label-suffix=":" :model="detail">
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

            </el-form>
        </el-dialog>
    </div>
</template>


<script>
import { getCurrentInstance, h, onMounted, reactive, ref, toRaw } from 'vue'
import utils from '../utils/utils';

export default {
    name: "leave",
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

        const action = ref('create');// 操作类型:create:创建，delete:作废
        const showModal = ref(false);
        const showDetailModal = ref(false); // 休假详情弹窗
        const active = ref(0); // 步骤条的当前激活步骤

        // 休假详情
        const detail = reactive({
            applyTypeName: '', // 休假类型
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            leaveTime: '', // 休假时长
            reasons: '', // 休假原因
            applyStateName: '', // 审批状态
            curAuditUserName: '', // 审批人
        });

        // 表单验证规则
        // 这里的rules是一个对象，包含了每个表单项的验证规则
        const rules = reactive({
            applyType: [
                { required: true, message: '请选择休假类型', trigger: 'change' },
            ],
            startTime: [
                { type: "date", required: true, message: '请选择开始日期', trigger: 'change' },
            ],
            endTime: [
                { required: true, message: '请选择结束日期', trigger: 'change' },
            ],
            reasons: [
                { required: true, message: '请输入休假原因', trigger: 'blur' },
            ],
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
            let params = { ...queryForm, ...pager };
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

        const handleClose = (form) => {
            showModal.value = false; // 关闭弹窗
            handleReset(form); // 重置表单
            leaveForm.endTime = ''; // 显式重置 endTime

        };
        //计算休假时长
        const handleDateChange = (key, val) => {
            let { startTime, endTime } = leaveForm;
            if (!startTime || !endTime) return; // 如果没有选择开始或结束时间，直接返回
            if (startTime > endTime) {
                ElMessage.error('开始时间不能大于结束时间'); // 提示错误信息
                setTimeout(() => {
                    leaveForm[key] = ''; // 清空当前选择的日期
                }, 0);
                leaveForm.leaveTime = '0天'; // 重置休假时长
                return;
            } else {
                leaveForm.leaveTime = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1 + '天'; // 计算休假时长
            }
        };
        //申请提交
        const handleSubmit = () => {
            proxy.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    // 提交表单数据
                    let params = { ...leaveForm, action: action.value }; // 合并表单数据和操作类型
                    try {
                        await proxy.$api.leaveOperate(params); // 调用创建申请的 API
                        ElMessage.success('申请成功');
                        handleClose('dialogForm'); // 关闭弹窗
                        getApplyList(); // 刷新申请列表
                    } catch (error) {
                        console.error('提交申请出错', error) // 添加错误日志
                    }
                } else {
                    console.log('表单验证失败!'); // 添加日志输出
                }
            });
        };

        // 申请休假弹窗
        const handleApply = () => {
            showModal.value = true; // 显示弹窗
            action.value = 'create'; // 设置操作类型为创建
        };
        //查看详情弹窗
        const handleDetail = (row) => {
            showDetailModal.value = true; // 显示详情弹窗
            let data = { ...row };
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
            // 设置步骤条的当前激活步骤
            if (data.applyState == 5) {
                active.value = 2; // 设置步骤条的当前激活步骤为审批中
            } else {
                active.value = data.applyState > 2 ? 3 : data.applyState;
            } 
        };
        //作废按钮
        const handleDelete = (row) => {
            ElMessageBox.confirm('确定要删除该休假申请吗？', '提示', {
                type: 'warning',
            }).then(async () => {
                try {
                    await proxy.$api.leaveOperate({
                        _id: row._id,
                        action: 'delete',
                    });
                    ElMessage.success('删除成功');
                    getApplyList(); // 刷新申请列表
                } catch (error) {
                    console.error('删除申请出错', error) // 添加错误日志
                }
            })
        }

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
            showModal,
            showDetailModal,
            rules,
            detail,
            active,

            getApplyList,
            handleReset,
            handleCurrentChange,
            handleApply,
            handleClose,
            handleSubmit,
            handleDateChange,
            handleDetail,
            handleDelete,
            handleQuery,
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