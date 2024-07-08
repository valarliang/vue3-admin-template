<script setup>
import Navbar from './components/Navbar.vue'
import Sidbar from './components/Sidbar/index.vue'
import Main from './components/Main.vue'
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <el-scrollbar>
        <Sidbar />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <Navbar />
      </el-header>

      <el-main>
        <el-scrollbar>
          <Main />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.layout-container {
  height: 100vh;
  .el-aside {
    width: $sideBarWidth;
    background: $menuBg;
  }
  .el-header {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background: #fff;
  }
}
</style>
