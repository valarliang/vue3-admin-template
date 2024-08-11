<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { privateRoutes, publicRoutes } from '@/router'
import SidebarItem from './SidebarItem'
import { useRoute } from 'vue-router'

const themeStore = useThemeStore()
const { menuBg, menuText, menuActiveText } = themeStore.cssVar
const route = useRoute()
const isCollapse = ref(false)
const showLogo = ref(false)
const permission_routes = publicRoutes.concat(privateRoutes)
</script>

<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
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

<style lang="scss" scoped></style>
