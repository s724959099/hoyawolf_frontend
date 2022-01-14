import axios from 'axios'

const service = axios.create({
  // baseURL: process.env.VUE_APP_WOLF_API,
  baseURL: '/api',
  timeout: 50000,
})

// 請求
service.interceptors.request.use(
  (config) => {
    return config
  },
  (request) => {
    console.log(
      `%cResponse:%c${request}`,
      'background:yellow; padding: 3px;',
      'padding: 3px;'
    )
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

    alert(error)
    return Promise.reject(error)
  }
)
export default service
