<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon.vue'
import { useAppStore } from '@/stores'
import { computed } from 'vue'

const appStore = useAppStore()
const lang = computed(() => appStore.language)
const { setLanguage } = appStore
const props = defineProps({
  fontSize: {
    type: String,
    default: '20px'
  }
})
</script>

<template>
  <el-dropdown trigger="click">
    <SvgIcon class="svg" name="language" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="setLanguage('zh')" :disabled="lang === 'zh'"
          >简体中文</el-dropdown-item
        >
        <el-dropdown-item @click="setLanguage('en')" :disabled="lang === 'en'"
          >English</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.svg {
  font-size: v-bind('props.fontSize');
  outline: none;
  cursor: pointer;
}
</style>
