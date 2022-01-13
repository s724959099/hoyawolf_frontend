<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>Opensea 地板價主動通知</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          追蹤喜愛的 NFT項目，主動用Line通知
        </div>
        <v-btn
          color="cyan lighten-2 white--text"
          x-large
          elevation="2"
          @click="notifyEvent"
          >開啟Line通知
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import Qs from 'qs'
import { mapState, mapActions } from 'vuex'
// API
import {
  lineRedirectAPI,
  getNotifyAccessTokenAPI,
  getUserNotifyAccessTokenAPI,
} from '@/api/line'
// getNotifyAuthorizationAPI,

export default {
  name: 'MemberNotify',
  data() {
    return {
      query: {},
      url: `${location.origin}/member/notify`,
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    // if (this.query && this.isLogin && this.notify) this.getData()
  },

  methods: {
    ...mapActions({
      setNotify: 'SET_NOTIFY',
    }),

    // 請求 Notify 授權
    async test1() {
      let loginUrl = 'https://notify-bot.line.me/oauth/authorize?'
      loginUrl += 'response_type=code'
      loginUrl += `&client_id=${process.env.VUE_APP_LINE_NOTIFY_CLIENT_ID}`
      loginUrl += `&redirect_uri=https://localhost:9527` // 要接收回傳訊息的網址
      loginUrl += `&state=123098sdfgklaesr29348`
      loginUrl += '&scope=notify'

      window.open(loginUrl, '_self') // 轉跳到該網址
    },

    // [Step1] 請求 Notify 授權
    async notifyEvent() {
      console.log(process.env.NODE_ENV)
      // const url =
      //   process.env.NODE_ENV === 'development'
      //     ? `https://29e0-125-227-188-115.ngrok.io/member/notify`
      //     : `${location.origin}/member/notify`
      const url = `${location.origin}`
      // const url = `${process.env.VUE_APP_LINE_NOTIFY_REDIRECT_URL}`
      console.log('url', url)
      window.open(lineRedirectAPI(url))
    },

    async getData() {
      try {
        this.query = this.$route.query

        const result = await getUserNotifyAccessTokenAPI(
          this.query.code,
          this.url
        )
        console.log(result)

        this.setNotify(result)
      } catch (error) {
        console.error(error)
        alert(error)
      }
    },

    // [Step2] 取得使用者 Notify Token
    async getNotifyToken() {
      try {
        const param = Qs.stringify({
          grant_type: 'authorization_code',
          code: this.query.code,
          state: this.query.state,
          redirect_uri: process.env.VUE_APP_LINE_REDIRECT_URL,
          client_id: process.env.VUE_APP_LINE_NOTIFY_CLIENT_ID,
          client_secret: process.env.VUE_APP_LINE_CLIENT_SECTET,
        })

        const result = await getNotifyAccessTokenAPI(param)

        if (result) {
          this.setNotify(result.data)
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style></style>
