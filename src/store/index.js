import Vue from 'vue'
import Vuex from 'vuex'
// Plugin
import createPersistedState from 'vuex-persistedstate'
// 加密
import SecureLS from 'secure-ls'
const ls = new SecureLS({ isCompression: false })
Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'wolf',
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],

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
    CLEAR_DATA(state) {
      state.isLogin = false
      state.info = {}
      state.notify = {}
    },
  },
  actions: {},
})

export default store
