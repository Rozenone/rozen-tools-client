import axios from 'axios'
import useStore from '@/stores'
import { Notify } from 'quasar'

// 创建 axios 实例
const request = axios.create({
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const store = useStore()
    const { enabled, host, port, username, password } = store.top.proxy

    // 如果启用了代理,添加代理配置
    if (enabled && host && port) {
      config.proxy = {
        host,
        port: Number(port)
      }

      // 如果设置了认证信息
      if (username && password) {
        config.proxy.auth = {
          username,
          password
        }
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    Notify.create({
      type: 'negative',
      message: error.message || '请求失败'
    })
    return Promise.reject(error)
  }
)

export default request 