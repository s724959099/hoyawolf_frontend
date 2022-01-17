export default {
  $log: (...params) => console.log(...params),
  $error: (...params) => console.error(...params),
  $warn: (...params) => console.warn(...params),
}
