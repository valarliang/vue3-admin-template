<script setup lang="ts">
import { useUserStore, useThemeStore } from '@/stores'
import { ArrowDown } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Language from '@/components/Language.vue'
import ThemeSelect from '@/components/ThemeSelect.vue'

const userStore = useUserStore()
const logout = userStore.logout
const themeStore = useThemeStore()
</script>

<template>
  <div class="navbar">
    <div class="left">
      <el-icon @click="themeStore.toggleSidebarCollapse"
        ><component :is="themeStore.sidebarCollapse ? 'Expand' : 'Fold'"
      /></el-icon>
      <Breadcrumb />
    </div>
    <div class="right">
      <Language />
      <ThemeSelect />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.userInfo.username }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">{{ $t('navBar.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .left {
    display: flex;
    align-items: center;
    .el-icon {
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    height: 100%;
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>
