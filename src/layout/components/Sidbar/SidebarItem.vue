<script setup name="SidebarItem">
import { isExternal } from '@/utils'
import Item from './Item'
import { ref } from 'vue'

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})
const { item, basePath } = props
const onlyOne = ref(item)
function resolvePath(routePath) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(basePath)) {
    return basePath
  }
  return routePath.startsWith('/') ? routePath : `${basePath}/${routePath}`
}
function onlyOneShowing() {
  const children = item.children?.filter((child) => !child.hidden)
  if (!children) {
    return true
  }
  if (children.length === 1) {
    onlyOne.value = children[0]
    return true
  }
  return false
}
</script>

<template>
  <div v-if="!item.hidden">
    <el-menu-item v-if="onlyOneShowing()" :index="resolvePath(onlyOne.path)">
      <Item
        v-if="onlyOne.meta"
        :icon="onlyOne.meta && onlyOne.meta.icon"
        :title="onlyOne.meta.title"
      />
    </el-menu-item>

    <el-sub-menu v-else ref="subMenu" :index="item.path">
      <template #title>
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped></style>
