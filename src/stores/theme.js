import { defineStore } from 'pinia'
import { ref } from 'vue'
import variables from '@/assets/styles/variables.module.scss'
import Color from 'color'
import { setItem, getItem, removeItem } from '@/utils/storage'

// Element Plus 默认颜色变量
const defaultColors = {
  '--el-color-primary': '#409EFF',
  '--el-color-success': '#67C23A',
  '--el-color-warning': '#E6A23C',
  '--el-color-danger': '#F56C6C',
  '--el-color-info': '#909399'
}
const THEME_KEY = 'theme_color'
const DEFAULT_THEME = defaultColors['--el-color-primary']

/**
 * 生成主题色的不同色阶
 * @param {string} primary 主题色
 * @returns {Object} 色阶对象
 */
function generateThemeColors(primary) {
  const colors = {}
  const baseColor = Color(primary)

  // 生成主题色的不同亮度变体
  colors['--el-color-primary'] = primary
  colors['--el-color-primary-dark-2'] = baseColor.darken(0.2).hex()
  colors['--el-color-primary-light-3'] = baseColor.lighten(0.2).hex()
  colors['--el-color-primary-light-5'] = baseColor.lighten(0.3).hex()
  colors['--el-color-primary-light-7'] = baseColor.lighten(0.4).hex()
  colors['--el-color-primary-light-8'] = baseColor.lighten(0.45).hex()
  colors['--el-color-primary-light-9'] = baseColor.lighten(0.48).hex()

  // 基于默认颜色调整其他类型颜色的亮度
  const brightnessDiff = baseColor.lightness() - Color(DEFAULT_THEME).lightness()

  // 调整其他类型颜色的亮度以匹配主题色的亮度变化
  Object.entries({
    '--el-color-success': defaultColors['--el-color-success'],
    '--el-color-warning': defaultColors['--el-color-warning'],
    '--el-color-danger': defaultColors['--el-color-danger'],
    '--el-color-info': defaultColors['--el-color-info']
  }).forEach(([key, value]) => {
    const color = Color(value)
    const newLightness = Math.max(0, Math.min(100, color.lightness() + brightnessDiff))
    colors[key] = color.lightness(newLightness).hex()
  })

  return colors
}

export const useThemeStore = defineStore('theme', () => {
  const sidebarCollapse = ref(false)
  const theme_local = getItem(THEME_KEY)
  const theme = ref(theme_local !== 'null' ? theme_local : DEFAULT_THEME)

  const cssVar = ref({
    ...variables,
    menuActiveText: theme.value || DEFAULT_THEME,
    menuHover: theme.value || DEFAULT_THEME
  })

  function toggleSidebarCollapse() {
    sidebarCollapse.value = !sidebarCollapse.value
  }

  function setTheme(newTheme) {
    const el = document.documentElement

    // 如果清空颜色，恢复默认颜色
    if (!newTheme) {
      theme.value = DEFAULT_THEME
      Object.entries(defaultColors).forEach(([key, value]) => {
        el.style.setProperty(key, value)
      })
      removeItem(THEME_KEY)
      return
    }

    // 设置新主题色
    theme.value = newTheme
    const colors = generateThemeColors(newTheme)
    Object.entries(colors).forEach(([key, value]) => {
      el.style.setProperty(key, value)
    })
    setItem(THEME_KEY, newTheme)
  }

  // 初始化主题色
  setTheme(theme.value)

  return {
    cssVar,
    sidebarCollapse,
    toggleSidebarCollapse,
    theme,
    setTheme
  }
})
