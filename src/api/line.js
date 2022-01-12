import { lineRequest, notifyRequest } from '@/utils/line-request'

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

export function getNotifyTokenAPI(data) {
  return notifyRequest({
    url: '/oauth2/authorize',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}
