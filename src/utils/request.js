import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
// import { isCheckTimeout } from '@/utils/auth'
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config // 必须返回配置
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const { success, message } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return response.data
    } else {
      // 业务错误
      ElMessage.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    const { message } = error.response.data
    // 处理 token 超时问题
    // if (
    //   error.response &&
    //   error.response.data &&
    //   error.response.data.code === 401
    // ) {
    //   // token超时
    //   store.dispatch('user/logout')
    // }
    ElMessage.error(message) // 提示错误信息
    return Promise.reject(error.response.data)
  }
)
service.get('/test')
export default service
