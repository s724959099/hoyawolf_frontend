import Vue from 'vue'
import Vuex from 'vuex'
// Plugin
import LogRocket from 'logrocket'
import createPersistedState from 'vuex-persistedstate'
import createPlugin from 'logrocket-vuex'
const logrocketPlugin = createPlugin(LogRocket)
// 加密
import SecureLS from 'secure-ls'
const ls = new SecureLS({ isCompression: false })
Vue.use(Vuex)

// API
import { getUserInfoAPI, getAddresssRecommendAPI } from '@/api/user'

const store = new Vuex.Store({
  plugins: [
    logrocketPlugin,
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
    opensea: [], // 使用者訂閱opensea項目
    addressTrack: [], // 使用者訂閱聰明錢包
    recommendAddressList: [], // 推薦追蹤錢包
    isLogin: false,
    info: {},
    notify: '', // 存放 Notify Access Token

    apiParams: {}, // 給 API 參數

    // 通知訊息
    alert: {
      show: false,
      text: '',
      type: '',
    },

    // Table Footer 設定
    footerProps: {
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus',
      'items-per-page-text': '一頁幾筆',
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

    SET_ORDER_ITEM(state, { opensea, address_track }) {
      state.opensea = opensea
      state.addressTrack = address_track
    },

    CHECK_NOTIFY_TOKEN(state) {
      if (state.info.idTokenDecode.sub) {
        this.dispatch('getUserOrderItem')
      } else {
        this.dispatch('showAlert', {
          show: true,
          text: '請先至「推播設定」，同意Line推播後，才可使用功能',
          type: 'warning',
        })
      }
    },

    SET_PARAMS(state) {
      state.apiParams = {
        user_id: state.info.idTokenDecode.sub,
        access_token: state.notify,
      }
    },
  },
  actions: {
    closeAlert({ commit }) {
      const alertData = {
        text: '',
        type: 'info',
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

    async getUserOrderItem({ commit, state }) {
      try {
        const { data } = await getUserInfoAPI(state.info.idTokenDecode.sub)
        if (data.opensea.length > 0) {
          data.opensea.forEach((item) => {
            item.action = true
            item.url = `https://opensea.io/collection/${item.name}`
          })
        }

        commit('SET_ORDER_ITEM', data)
      } catch (error) {
        this._vm.$error(error)
      }
    },

    // 取得推薦錢包
    async getRecommendWallet(state) {
      try {
        const { data } = await getAddresssRecommendAPI()
        state.recommendAddressList = data
      } catch (error) {
        this._vm.$error(error)
      }
    },
  },
})

export default store
