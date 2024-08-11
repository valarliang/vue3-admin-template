import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
// import { isCheckTimeout } from '@/utils/auth'
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (request) => {
    const userStore = useUserStore()
    if (userStore.token) {
      request.headers.Authorization = `Bearer ${userStore.token}`
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const { success, message } = response.data

    if (success) {
      return response.data
    } else {
      // 业务错误
      ElMessage.error(message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    const { message } = error.response.data
    const userStore = useUserStore()
    // 处理 token 超时问题
    if (error.response.status === 401) {
      userStore.logout()
    }
    ElMessage.error(message) // 提示错误信息
    return Promise.reject(error.response.data)
  }
)
// service.get('/test')
export default service
