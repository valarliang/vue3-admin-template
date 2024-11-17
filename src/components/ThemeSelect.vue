<template>
  <el-dialog v-model="dialogVisible" title="主题设置" width="30%">
    <div class="theme-picker-item">
      <span>主题色</span>
      <el-color-picker
        v-model="themeColor"
        :predefine="[
          '#409EFF',
          '#1890ff',
          '#304156',
          '#212121',
          '#11a983',
          '#13c2c2',
          '#6959CD',
          '#f5222d'
        ]"
        @change="handleThemeChange"
      />
    </div>
  </el-dialog>

  <el-tooltip effect="dark" content="主题设置" placement="bottom">
    <div class="theme-switch" @click="dialogVisible = true">
      <el-icon><Brush /></el-icon>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Brush } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()
const dialogVisible = ref(false)
const themeColor = ref(themeStore.theme)

const handleThemeChange = (color) => {
  themeStore.setTheme(color)
}

watch(
  () => themeStore.theme,
  (newVal) => {
    themeColor.value = newVal
  }
)
</script>

<style scoped lang="scss">
.theme-switch {
  display: flex;
  padding: 0 15px;
  cursor: pointer;
  font-size: 20px;
}

.theme-picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
</style>
