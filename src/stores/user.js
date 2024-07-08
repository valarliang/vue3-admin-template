import { defineStore } from 'pinia'
import md5 from 'md5'
import { computed, ref } from 'vue'
import { login, register, getUserInfo } from '@/api/user'
import { setItem, getItem } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref(getItem('token') || '')
  const userInfo = ref({})
  const hasUserInfo = computed(() => JSON.stringify(userInfo.value) !== '{}')
  function loginAct({ username, password }) {
    return login({
      username,
      password: md5(password)
    }).then((res) => {
      token.value = res.token
      setItem('token', res.token)
      return res
    })
  }
  function registerAct({ username, password }) {
    return register({
      username,
      password: md5(password)
    })
  }
  function getUserInfoAct() {
    return getUserInfo().then((res) => {
      userInfo.value = res
    })
  }

  return { token, loginAct, registerAct, userInfo, hasUserInfo, getUserInfoAct }
})
