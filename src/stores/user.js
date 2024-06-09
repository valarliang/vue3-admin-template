import { defineStore } from 'pinia'
import md5 from 'md5'
import { ref } from 'vue'
import { login, register } from '@/api/user'
import { setItem, getItem } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref(getItem('token') || '')
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

  return { token, loginAct, registerAct }
})
