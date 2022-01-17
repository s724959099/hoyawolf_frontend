import axios from 'axios'
import Vue from '../main'

// --------- API實體 ---------
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api'
      : process.env.VUE_APP_WOLF_API,
  timeout: 50000,
})

// 請求
service.interceptors.request.use(
  (config) => {
    return config
  },
  (request) => {
    Vue.$log(
      `%cResponse:%c${request}`,
      'background:yellow; padding: 3px;',
      'padding: 3px;'
    )
    return request
  },
  (error) => {
    Vue.$error(error)
    return Promise.reject(error)
  }
)

// 回應
service.interceptors.response.use(
  (response) => {
    Vue.$log(
      `%c✅ Response:%c${response.config.url}`,
      'background:deepskyblue; padding: 3px;',
      'padding: 3px;',
      response.data
    )
    return response
  },
  (error) => {
    Vue.$error('DEBUG: ⛔ 請求發生錯誤：', error)
    return Promise.reject(error)
  }
)
export default service
