<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores'
import { privateRoutes, publicRoutes } from '@/router'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
import { useRoute } from 'vue-router'

const themeStore = useThemeStore()
const { menuBg, menuText, menuActiveText } = themeStore.cssVar
const route = useRoute()
const showLogo = ref(false)
const permission_routes = [...publicRoutes, ...privateRoutes]
</script>

<template>
  <div :class="{ 'has-logo': showLogo }">
    <Logo :collapse="themeStore.sidebarCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="route.path"
        :collapse="themeStore.sidebarCollapse"
        :background-color="menuBg"
        :text-color="menuText"
        :unique-opened="false"
        :active-text-color="menuActiveText"
        router
      >
        <SidebarItem
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>
