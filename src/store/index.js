import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    info: {},
  },
  mutations: {
    CHANGE_LOGIN(state, boolean) {
      state.isLogin = boolean
    },
    SET_USER_INFO(state, data = {}) {
      state.info = data || {}
    },
  },
  actions: {},
})

export default store
