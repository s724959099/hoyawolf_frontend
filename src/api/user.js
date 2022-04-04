import request from '@/utils/request'

// ------- 訂閱推播 -------

// 註冊 Opensea 地板價通知
export function registerOpenseaNotifyAPI(data) {
  return request({
    url: `/api/line/opensea/register/`,
    method: 'post',
    data,
  })
}

// 註冊 Opensea Address 追蹤錢包通知
export function registerAddressNotifyAPI(data) {
  return request({
    url: `/api/line/opensea/address/register/`,
    method: 'post',
    data,
  })
}

// ------- 追蹤錢包 -------

// 查詢推薦地址
export function getAddresssRecommendAPI() {
  return request({
    url: `/api/line/opensea/address/recommend/`,
    method: 'get',
  })
}

// 新增推薦地址
export function addAddresssRecommendAPI() {
  return request({
    url: `/api/line/opensea/address/recommend/`,
    method: 'post',
  })
}

// 刪除推薦地址
export function deleteAddresssRecommendAPI(address) {
  return request({
    url: `/api/line/opensea/address/recommend/${address}`,
    method: 'delete',
  })
}

// 取得該 User 所有的 opensea 推播通知
export function getUserInfoAPI(user_id) {
  return request({
    url: `/api/user/info/?user_id=${user_id}`,
    method: 'get',
  })
}

// 刪除 User Token
export function deleteUserAPI(token_id) {
  return request({
    url: `/api/user/token/${token_id}/`,
    method: 'delete',
  })
}

// 刪除 Address By Token
export function deleteAddressNotifyAPI(token_id) {
  return request({
    url: `/api/user/address/token/${token_id}/`,
    method: 'delete',
  })
}

// 錢包分析 Address Profit
export function addressProfitAPI(data) {
  return request({
    url: `/api/line/opensea/address_profit/`,
    method: 'post',
    data
  })
}
