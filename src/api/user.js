import request from '@/utils/request'

// 登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
// 注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/profile'
  })
}
export const feature = () => {
  return request({
    url: '/user/feature'
  })
}
export const chapter = () => {
  return request({
    url: '/user/chapter'
  })
}
