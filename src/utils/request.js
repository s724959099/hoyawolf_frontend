import axios from 'axios'

const isDev = process.env.NODE_ENV === 'development'
const service = axios.create({
  baseURL: isDev ? '/api' : process.env.VUE_APP_WOLF_API,
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
    console.error(error)
    return Promise.reject(error)
  }
)

// 回應
service.interceptors.response.use(
  (response) => {
    console.log(
      `%cResponse:%c${response.config.url}`,
      'background:deepskyblue; padding: 3px;',
      'padding: 3px;',
      response.data
    )
    return response
  },
  (error) => {
    console.error(error) // for debug
    return Promise.reject(error)
  }
)
export default service
