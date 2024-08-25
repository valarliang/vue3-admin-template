<template>
  <el-breadcrumb>
    <TransitionGroup name="breadcrumb">
      <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ path: item.path }">
        {{ item.title }}
      </el-breadcrumb-item>
    </TransitionGroup>
  </el-breadcrumb>
</template>

<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'

const matched = ref([])
const route = useRoute()
watchEffect(() => {
  matched.value = route.matched
    .filter((i) => i.meta.title)
    .map((item) => ({ title: item.meta.title, path: item.path }))
})
</script>

<style lang="scss" scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}
.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-leave-active {
  position: absolute;
}
</style>
