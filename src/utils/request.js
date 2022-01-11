import axios from 'axios'

const isDev = process.env.NODE_ENV === 'development'
const service = axios.create({
  baseURL: isDev ? '/line' : process.env.VUE_APP_WOLF_API,
  timeout: 50000,
})

// 請求
service.interceptors.request.use(
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
service.interceptors.response.use(
  (response) => {
    const { res } = response.data
    return res
  },
  (error) => {
    console.error(error) // for debug
    return Promise.reject(error)
  }
)
export default service
