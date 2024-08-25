<script setup>
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const porps = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="logo">
    <el-avatar :src="userStore.userInfo.avatar" fit="contain" />
    <span :style="{ opacity: porps.collapse ? 0 : 1 }" class="name">
      {{ userStore.userInfo.username }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-avatar {
    width: 50px;
    height: 50px;
    margin: 10px 0;
    background-color: transparent;
  }
  .name {
    transition: var(--el-transition-duration) opacity ease-in-out;
    color: white;
    font-size: 20px;
  }
}
</style>
