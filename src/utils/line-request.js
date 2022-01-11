import axios from 'axios'

const lineRequest = axios.create({
  // baseURL: process.env.VUE_APP_LINE_API,
  baseURL: '/line',
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
    console.error(error) // for debug
    alert(error)
    return Promise.reject(error)
  }
)
export default lineRequest
