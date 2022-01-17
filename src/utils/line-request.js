import axios from 'axios'
import Vue from '../main'
const isDev = process.env.NODE_ENV === 'development'

const lineRequest = axios.create({
  baseURL: isDev ? '/line' : process.env.VUE_APP_LINE_API,
  timeout: 50000,
})

// 請求
lineRequest.interceptors.request.use(
  (config) => {
    return config
  },
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應
lineRequest.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    Vue.$error('DEBUG: ⛔ 請求發生錯誤：', error)
    return Promise.reject(error)
  }
)

const notifyRequest = axios.create({
  baseURL: isDev ? '/notify' : process.env.VUE_APP_LINE_NOTIFY_API,
  timeout: 50000,
})

export { lineRequest, notifyRequest }
