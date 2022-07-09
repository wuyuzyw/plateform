import axios from 'axios'
// 请求拦截
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})
// 导出axios实例
export const userAjax = axios.create({
  baseURL: 'http://127.0.0.1/user',
  timeout: 3000
})
