import { lineRequest, notifyRequest } from '@/utils/line-request'
import request from '@/utils/request'

// [Line 服務] 取得 Access Token，以取得使用者基本資訊
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

// [Line Notify 服務] [Step1] 請求 Notify 取得 User Authorization
export function getNotifyAuthorizationAPI(data) {
  return notifyRequest({
    url: '/oauth/authorize',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// [Line Notify 服務] [Step2] 拿 code 換 Access Token
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

// [Line Notify 服務] 推播
export function sendNotifyToUserAPI(data) {
  return notifyRequest({
    url: '/api/notify',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// [後端] [Step1] 請求 Notify 取得 User Authorization
export function lineRedirectAPI(url) {
  return `${process.env.VUE_APP_WOLF_API}/api/line/redirect?redirect_uri=${url}&state=913458sadg123`
}

// [未使用]
// [後端] [Step2] 拿 code 取得 User Notify Access Token
export function getUserNotifyAccessTokenAPI(code) {
  return request({
    url: `/api/line/line_notify_callback?code=${code}`,
    method: 'get',
  })
}
