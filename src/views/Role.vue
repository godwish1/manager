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
        <el-button type="primary" @click="handleAdd" v-has="'role-create'">创 建</el-button>
      </div>
      <!-- 渲染树形菜单要指定 row-key -->
      <el-table :data="roleList">
        
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template #default="scope">
            <el-button size="default" @click="handleEdit(scope.row)" v-has="'role-edit'">编 辑</el-button>
            <el-button size="default" @click="handleOpenPermission(scope.row)" v-has="'role-edit-power'">设置权限</el-button>
            <el-button size="default" type="danger" @click="handleDel(scope.row._id)" v-has="'role-delete'">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination class="pagination" background layout="prev, pager, next, jumper" :total="pager.total"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>

    <!-- 弹窗 -->
    <el-dialog title="角色新增" v-model="showModal" @close="handleClose">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="roleForm.remark" placeholder="请输入备注" />
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
    <el-dialog title="权限设置" v-model="showPermissionModal">
      <el-form label-width="100px">

        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <!-- tree树形控件 -->
          <el-tree ref="treeRef" style="max-width: 600px" :data="menuList" show-checkbox default-expand-all
            node-key="_id" highlight-current :props="{ label: 'menuName' }" />

        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermissionModal = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import utils from "@/utils/utils";
import { ElMessage } from "element-plus";

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
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",

          //此处用箭头函数使得this指向Vue组件实例
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let name = this.actionMap[key];
              if (key && name !== '系统管理' && name !== '审批管理') names.push(name);
            });
            return names.join(",");
          },
        },

        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value)); //new一个Date对象,然后把时间戳传进去 
          },
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
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },

      //弹窗显示控制
      showModal: false,
      showPermissionModal: false,
      roleForm: {},

      //表单验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },  //添加正则 //trigger 表示触发验证的时机
        ],
      },
      //编辑权限弹窗属性
      curRoleId: '',
      curRoleName: '',
      menuList: [],

      //权限菜单映射表
      actionMap: {},

    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },

  methods: {
    // 角色列表初始化
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleList({ ...this.queryForm, ...this.pager });
        this.roleList = list;
        this.pager.total = page.total; //数据包含分页信息，要设置分页变量接收
      } catch (e) {
        throw new Error(e);
      }
    },

    // 菜单列表初始化
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList();
        this.menuList = list;
        this.getActionMap(list);
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

    // 编辑角色
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      // Vue异步更新机制
      // 等待DOM更新后执行
      this.$nextTick(() => {
        this.roleForm = { roleName: row.roleName, remark: row.remark, _id: row._id };
      });
    },

    // 删除角色
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
      this.showModal = false;
      this.handleReset("dialogForm");
      
    },

    // 分页器切换事件
    handleCurrentChange(current) {
      this.pager.pageNum = current; // 分页组件触发current-change事件时，会将当前页码作为第一个参数传入处理函数。
      this.getRoleList();
    },
    // 编辑权限
    handleOpenPermission(row) {
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      this.showPermissionModal = true;
      let { checkedKeys } = row.permissionList;
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(checkedKeys); // tree树形控件提供的setCheckedKeys:设置目前选中的节点
      });
    },
    //权限设置表单弹出提交
    async handlePermissionSubmit() {
      let nodes = this.$refs.treeRef.getCheckedNodes();
      let halfKeys = this.$refs.treeRef.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map(node => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys: checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        }
      };
      await this.$api.roleUpdatePermission(params);
      this.showPermissionModal = false;
      ElMessage.success('权限设置成功');
      this.getRoleList();
    },

    // 递归获取权限按钮列表  深度优先遍历（DFS）
    // getActionMap(list) {
    //   const actionMap = {};
    //   const deep = (arr) => {
    //     while (arr.length) {
    //       let item = arr.pop();  // pop 删除并返回数组的最后一个元素
    //       if (item.action && item.children) {
    //         actionMap[item._id] = item.menuName;
    //       }
    //       if (item.children && !item.action) {
    //         deep(item.children);
    //       }
    //     }
    //   }
    //   deep(JSON.parse(JSON.stringify(list))); //深拷贝
    //   //deep(cloneDeep(list)); // 更安全的深拷贝
    //   this.actionMap = actionMap;
    // },
    getActionMap(list) {
      const actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          const item = arr.pop();

          // 🔴 1. 处理父节点的action数组（按钮权限）
          if (item.action) {
            item.action.forEach(btn => {
              actionMap[btn._id] = btn.menuName;
            });
          }

          // 🔴 2. 处理当前节点本身（菜单或按钮）
          actionMap[item._id] = item.menuName; // 直接记录当前节点名称

          // 🔴 3. 递归处理子节点
          if (item.children) {
            deep(item.children);
          }
        }
      };

      deep(JSON.parse(JSON.stringify(list))); // 深拷贝防止修改原始数据
      this.actionMap = actionMap;
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