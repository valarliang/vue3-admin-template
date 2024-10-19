<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const locale = computed(() => (appStore.language === 'zh' ? zh : en))
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
