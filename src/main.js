import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import './permission'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import Console from './utils/console'
import './style/index.scss' // css樣式

Vue.prototype.$isDev = () => process.env.NODE_ENV === 'development'

/**
 * dev 模式下才會印出 console
 * this.$log(), this.$error(), this.$warn()
 * @date 2022-01-17
 * @param {any} 傳入任何型別
 */
Object.keys(Console).forEach((consoleEvents) => {
  Vue.prototype[consoleEvents] = (...params) => {
    if (process.env.VUE_APP_CONSOLE === 'true')
      return Console[consoleEvents](...params)
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app')
