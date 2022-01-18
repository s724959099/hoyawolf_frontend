import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Console from '@/utils/console'
import './permission'
import './style/index.scss' // css樣式

/**
 * dev 模式下才會印出 console
 * this.$log(), this.$error(), this.$warn()
 * @date 2022-01-17
 * @param {any} 傳入任何型別
 */
Object.keys(Console).forEach((consoleEvents) => {
  Vue.prototype[consoleEvents] = (...params) => {
    if (process.env.VUE_APP_CONSOLE === 'true') {
      return Console[consoleEvents](...params)
    }
  }
})

Vue.prototype.$isDev = () => process.env.NODE_ENV === 'development'

// ------- LogRocker
import LogRocket from 'logrocket'
if (process.env.NODE_ENV === 'production') LogRocket.init('goldenf/hoyawolf')

Vue.config.productionTip = false

const vue = new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app')

export default vue
