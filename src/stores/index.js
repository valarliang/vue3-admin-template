export * from './user.js'
export * from './theme.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setItem, getItem } from '@/utils/storage'
import i18n from '@/i18n'

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
