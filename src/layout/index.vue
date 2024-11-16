<template>
  <el-container class="layout-container">
    <el-aside>
      <Sidbar />
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

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Sidbar from './components/Sidbar/index.vue'
import Main from './components/Main.vue'
import { useThemeStore } from '@/stores'
import { computed } from 'vue'

const themeStore = useThemeStore()
const { sideBarWidth, hideSideBarWidth } = themeStore.cssVar
const width = computed(() => (themeStore.sidebarCollapse ? hideSideBarWidth : sideBarWidth))
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';
.layout-container {
  height: 100vh;
  .el-aside {
    width: v-bind(width);
    transition: var(--el-transition-duration) width ease-in-out;
    background: $menuBg;
  }
  .el-header {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background: #fff;
  }
}
</style>
