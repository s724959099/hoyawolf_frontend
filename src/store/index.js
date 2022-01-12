import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    info: {},
    notify: {}, // 存放 Notify 資料
  },
  mutations: {
    CHANGE_LOGIN(state, boolean) {
      state.isLogin = boolean
    },
    SET_USER_INFO(state, data = {}) {
      state.info = data
    },
    SET_NOTIFY(state, data = {}) {
      state.notify = data
    },
  },
  actions: {},
})

export default store
