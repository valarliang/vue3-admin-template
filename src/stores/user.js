import { defineStore } from 'pinia'
import md5 from 'md5'
import { computed, ref } from 'vue'
import { login, register, getUserInfo } from '@/api/user'
import { setItem, getItem } from '@/utils/storage'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(getItem('token') || '')
  const userInfo = ref({})
  const hasUserInfo = computed(() => JSON.stringify(userInfo.value) !== '{}')
  const router = useRouter()

  function setToken(value) {
    token.value = value
    setItem('token', value)
  }
  function loginAct({ username, password }) {
    return login({
      username,
      password: md5(password)
    }).then((res) => {
      setToken(res.token)
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
  function logout() {
    setToken('')
    userInfo.value = {}
    router.push('/login')
  }

  return {
    token,
    loginAct,
    registerAct,
    userInfo,
    hasUserInfo,
    getUserInfoAct,
    logout
  }
})
