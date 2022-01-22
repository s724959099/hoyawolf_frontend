import axios from 'axios'
import Vue from '../main'
import store from '../store'
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

// ------- Line Notify --------
const notifyRequest = axios.create({
  baseURL: `${process.env.VUE_APP_LINE_NOTIFY_API}`,
  timeout: 50000,
})

// 請求
notifyRequest.interceptors.request.use(
  (config) => {
    if (store.state.notify)
      config.headers['Authorization'] = 'Bearer ' + store.state.notify
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
notifyRequest.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    const { error } = err.response.data
    if (error) store.dispatch('showError', error.message)

    Vue.$error('DEBUG: ⛔ 請求發生錯誤：', err.response)
    return Promise.reject(err)
  }
)

export { lineRequest, notifyRequest }
