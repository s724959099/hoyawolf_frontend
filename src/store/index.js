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
    notify: '', // 存放 Notify Access Token

    // 通知訊息
    alert: {
      show: false,
      text: '',
      type: '',
    },
  },

  mutations: {
    CHANGE_LOGIN(state, boolean) {
      state.isLogin = boolean
    },
    SET_USER_INFO(state, data = {}) {
      state.info = data
    },
    SET_NOTIFY(state, data = '') {
      state.notify = data
    },
    CLEAR_DATA(state) {
      state.isLogin = false
      state.info = {}
      state.notify = ''
      localStorage.clear()
    },
    SET_ALERT(state, { text, type, show }) {
      state.alert.text = text
      state.alert.type = type
      state.alert.show = show
    },
  },
  actions: {
    closeAlert({ commit }) {
      const alertData = {
        text: '',
        type: '',
        show: false,
      }
      commit('SET_ALERT', alertData)
    },
    showAlert({ commit, dispatch }, alertData) {
      commit('SET_ALERT', alertData)

      setTimeout(() => {
        dispatch('closeAlert')
      }, 3000)
    },

    showError({ commit, dispatch }, text) {
      commit('SET_ALERT', {
        show: true,
        type: 'error',
        text: `發生錯誤：${text}`,
      })

      setTimeout(() => {
        dispatch('closeAlert')
      }, 3000)
    },
  },
})

export default store
