/**
 * console 工具
 * @date 2022-01-18
 * @param {any} ...params 任何傳的東西，都會拆解來 console
 * @returns {any} 拆解後的內容
 */
export default {
  $log: (...params) => console.log(...params),
  $error: (...params) => console.error(...params),
  $warn: (...params) => console.warn(...params),
}
