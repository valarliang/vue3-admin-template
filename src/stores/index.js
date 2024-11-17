export * from './user.js'
export * from './theme.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setItem, getItem } from '@/utils/storage'
import i18n from '@/i18n'

// defineStore()第一个参数要求是一个独一无二的名字，用作 id ，是必须传入的， Pinia 将用它来连接 store 和 devtools
export const useAppStore = defineStore('app', () => {
  const language = ref(getItem('lang') || 'zh')

  function setLanguage(lang) {
    i18n.global.locale.value = lang
    language.value = lang
    setItem('lang', lang)
  }

  return {
    language,
    setLanguage
  }
})
