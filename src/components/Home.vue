<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user">用户</div>
      </div>
      <div class="wrapper">
        <div class="home-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
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

  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex; //水平排列
      justify-content: space-between; //两端对齐
      border-bottom: 1px solid #ddd;
    }

    .wrapper {
      padding: 20px;
      background: #eef0f3;
      height: calc(100vh - 50px);
      .home-page {
        background: #fff;
        padding: 20px;
        height: 100%;

      }
    }
  }

}
</style>
