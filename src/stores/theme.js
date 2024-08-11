import { defineStore } from 'pinia'
import { ref } from 'vue'
import variables from '@/assets/styles/variables.module.scss'

/**
 * defineStore()第一个参数要求是一个独一无二的名字，用作 id ，是必须传入的， Pinia 将用它来连接 store 和 devtools
 */
// const cssVar =
export const useThemeStore = defineStore('theme', () => {
  const cssVar = ref(variables)
  return {
    cssVar
  }
})
