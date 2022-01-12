import { lineRequest, notifyRequest } from '@/utils/line-request'
import request from '@/utils/request'

// 取得 Access Token
export function getLineAccessTokenAPI(data) {
  return lineRequest({
    url: '/oauth2/v2.1/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 拿 code 換 Notify Access Token
export function getNotifyAccessTokenAPI(data) {
  return notifyRequest({
    url: '/oauth2/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 向後端請求
export function lineRedirectAPI(data) {
  return request({
    url: '/api/line/redirect',
    method: 'get',
    data,
  })
}
