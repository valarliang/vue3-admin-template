import { createI18n } from 'vue-i18n'
import zh from './lang/zh'
import en from './lang/en'
import { getItem } from '@/utils/storage'

const language = (navigator.language || 'zh').split('-')[0]
const i18n = createI18n({
  // 使用 Composition API 模式，设置为false
  legacy: false,
  // 全局注入 $t 函数
  globalInjection: true,
  locale: getItem('lang') || language,
  fallbackLocale: 'zh',
  messages: { zh, en }
})

export default i18n
