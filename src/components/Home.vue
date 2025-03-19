<template>
  <div class="basic-layout">
    <div :class="['nav-side',isCollapse?'fold':'unfold']">
      <!-- 系统LOGO -->
       <div class='logo'>
        <img src="@/assets/images/logo.png">
        <span>Manager</span>
       </div>
       <!-- 导航菜单 -->
        <el-menu 
          router
        :default-active="activMenu" 
        :collapse="isCollapse"  
        background-color="#001529" 
        text-color="#fff"
        class="nav-menu">
        <!-- 传递菜单到树形菜单 -->
        <TreeMenu :userMenu="userMenu"/>
        </el-menu>
    </div>
    <div :class='["content-right",isCollapse?"unfold":"fold"]'>
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon style="font-size: 25px;padding: 20px;"><Fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb/>
          </div>
        </div>
        <div class="user-info">
           <!-- Bell按钮 + 通知角标提示，注释的是显示圆点提示  
            :is-dot="noticeCount > 0 ? true : false" -->
          <el-badge 
            class="notice" 
            type="danger" 
            @click="$router.push('/audit/approve')"
            :value="noticeCount">

            <el-icon class="bell-icon"><Bell /></el-icon>
          </el-badge>
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue';
import BreadCrumb from './BreadCrumb.vue';
import { eventBus } from '@/main.js';

export default {

  name: "Home",

  components: { // 注册子组件
      TreeMenu,
      BreadCrumb
  },
  data() {
    return {
      queryForm: {
        menuState: 1,
      },
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu:[],
      activMenu: location.hash.slice(1)
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
    // 监听menu.vue菜单更新事件
    eventBus.on('menu-updated', this.getMenuList);
  },
  // 组件销毁时移除监听
  beforeDestroy() {
    eventBus.off('menu-updated', this.getMenuList);
  },

  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    handleLogout(command) {
      if (command === 'email') {
        ElMessage.info(`邮箱：${this.userInfo.userEmail}`);
      } else if (command === 'logout') {
        this.$store.commit('saveUserInfo', '');
        this.userInfo = {};
        this.$router.push('/login');
      }
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        //这里noticeCount可以直接返回3是因为request.js中设置了code==200，直接返回data
        this.noticeCount = count;  
      } catch (error) {
        console.error(error);
      }

    },
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList();
        this.userMenu = list;
      } catch (error) {
        console.error(error);
      }

    }
  }
}
</script>


<style lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width .5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 6px;
        width: 64px;
        height: 50px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      display: flex;
      height: 50px;
      line-height: 50px;
      display: flex; //水平排列
      justify-content: space-between; //两端对齐
      border-bottom: 1px solid #ddd;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }

      .bread {
        padding-left: 30px;
        font-size: 20px;
        font-weight: 500;
      }

      .user-info {
        padding-right: 30px;
        padding-top: 15px;

        .notice {
          margin-top: -25px;
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }

        .user-link {
          font-size: 18px;
          cursor: pointer;
          color: #409eff;
        }

        .bell-icon {
          font-size: 24px; // 调整图标大小
          margin-top: 1px;
          color: #044a8f;
        }
      }
    }

    .wrapper {
      padding: 20px;
      background: #eef0f3;
      height: calc(100vh - 50px);

      .home-page {
        background: #fff;
        // padding: 20px;
        height: 100%;

      }
    }
  }

}
</style>
