import router from '@/router'
import { useUserStore } from './stores'

const whiteList = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.token) {
    if (to.path === '/login') {
      next('/') // 重定向首页
    } else {
      if (!userStore.hasUserInfo) {
        userStore.getUserInfoAct()
      }
      next()
    }
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next('/login')
  }
})
