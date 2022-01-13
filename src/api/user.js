import request from '@/utils/request'

// 註冊 Opensea 地板價通知
export function registerOpenseaNotify(data) {
  return request({
    url: `/api/line/opensea/register`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
}

// 取得該 user 所有的 opensea 推播通知
export function getUserInfo({ user_id }) {
  return request({
    url: `/api/user/info?${user_id}`,
    method: 'get',
  })
}

// 取得該 user 所有的 opensea 推播通知
export function getUserAllOsNotifyAPI({ token_id }) {
  return request({
    url: `/api/user/token?${token_id}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'delete',
  })
}
