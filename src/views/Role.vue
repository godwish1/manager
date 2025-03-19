<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getRoleList">查 询</el-button>
          <el-button @click="handleReset('form')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创 建</el-button>
      </div>
      <!-- 渲染树形菜单要指定 row-key -->
      <el-table :data="roleList">

        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>

        <el-table-column label="操作" width="270">
          <template #default="scope">
            <el-button size="default" @click="handleEdit(scope.row)">编 辑</el-button>
            <el-button size="default">设置权限</el-button>
            <el-button type="danger" size="default" @click="handleDel(scope.row._id)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
    </div>
    <div class="pagination-container">
      <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="pager.total"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>

    <!-- 弹窗 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹窗 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input v-model="roleForm.remark" placeholder="请输入备注" />
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
import utils from "@/utils/utils";
import { cloneDeep } from 'lodash-es'

export default {

  name: "role",

  data() {
    return {
      //定义查询表单
      queryForm: {
        roleName: '',
      },
      action: '',
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 150,
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "menuType",
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value)); //new一个Date对象,然后把时间戳传进去 
          },
        },

      ],
      //分页
      pager: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      //弹窗显示控制
      showModal: false,
      roleForm: {

      },
      //表单验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },  //添加正则 //trigger 表示触发验证的时机
        ],
      }

    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 角色列表初始化
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleList(this.queryForm);
        this.roleList = list;
        this.pager.total = page.total; //数据包含分页信息，要设置分页变量接收
      } catch (e) {
        throw new Error(e);
      }
    },
    // 查询信息重置
    handleReset(form) {
      this.$refs[form].resetFields(); // 通用重置表单方法
    },
    // 新增角色
    handleAdd() {
      this.showModal = true;
      this.action = "create";

    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      // Vue异步更新机制
      // 等待DOM更新后执行
      this.$nextTick(() => {
        // 深拷贝实现数据隔离
        this.roleForm = cloneDeep(row);
        //assign浅拷贝，将row对象中的属性值赋值给roleForm对象
        //Object.assign(this.roleForm, row); 
      });
    },
    async handleDel(_id) {
      const res = await this.$api.roleOperate({ _id, action: "delete" }); // ✅ 正确的API
      if (res) {
        ElMessage.success("删除成功");
        this.getRoleList();
      } else {
        ElMessage.error(res.msg || "删除失败");
      }
    },

    // 角色操作-提交
    handleSubmit() {
      //dialogForm为表单的ref,上面已经定义 
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, roleForm } = this; //通过this获取表单数据
          let params = { ...roleForm, action };
          let res = await this.$api.roleOperate(params);
          console.log(res)
          if (res) {
            this.showModal = false;
            ElMessage.success("操作成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          } else {
            ElMessage.error(res.msg || "操作失败");
          }

        }
      })
    },

    // 弹框关闭
    handleClose() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },

    // 分页器切换事件
    handleCurrentChange(pageNum) {
      this.pager.page = pageNum; // ✅ 修改 this.pager.page
      this.getRoleList();
    },
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