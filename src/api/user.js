import request from '@/utils/request'

// 註冊 Opensea 地板價通知
export function registerOpenseaNotifyAPI(data) {
  return request({
    url: `/api/line/opensea/register`,
    method: 'post',
    data,
  })
}

// 取得該 User 所有的 opensea 推播通知
export function getUserInfoAPI(user_id) {
  return request({
    url: `/api/user/info/${user_id}`,
    method: 'get',
  })
}

// 刪除 User Token
export function deleteUserAPI(token_id) {
  return request({
    url: `/api/user/token/${token_id}`,
    method: 'delete',
  })
}
