<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon.vue'

const props = defineProps({
  icon: String,
  title: String
})
const { icon, title } = props
function snakeToCamel(str) {
  return str
    .slice(3)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
</script>

<template>
  <el-icon v-if="icon.startsWith('el-')" :size="20"><component :is="snakeToCamel(icon)" /></el-icon>
  <SvgIcon v-else :name="icon" class="svg" />
  <span>{{ $t('route.' + title) }}</span>
</template>

<style lang="scss" scoped>
.el-icon {
  --el-menu-icon-width: 20px;
}
.svg {
  margin-right: 5px;
  font-size: 20px;
}
</style>
