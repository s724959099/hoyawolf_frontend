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
          @click="notifyEvent()"
          >開啟Line通知
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import Qs from 'qs'
import jwtDecode from 'jwt-decode'
import { mapMutations } from 'vuex'
// API
import {
  getLineAccessTokenAPI,
  getNotifyAccessTokenAPI,
  lineRedirectAPI,
} from '@/api/line'

export default {
  name: 'MemberSetting',
  data() {
    return {
      query: {},
      tokenResult: {},
      idTokenDecode: {},
    }
  },

  mounted() {
    if (this.query) this.getData()
  },

  methods: {
    ...mapMutations({
      changeLoginStatus: 'CHANGE_LOGIN',
      setUserInfo: 'SET_USER_INFO',
    }),

    // 請求使用者資料
    async getData() {
      // 接網址的參數
      try {
        this.query = this.$route.query

        const params = Qs.stringify({
          grant_type: 'authorization_code',
          code: this.query.code,
          redirect_uri: process.env.VUE_APP_LINE_REDIRECT_URL,
          client_id: process.env.VUE_APP_LINE_CHANNEL_ID,
          client_secret: process.env.VUE_APP_LINE_CHANNEL_SECRET,
        })

        const result = await getLineAccessTokenAPI(params)

        console.log(result)
        if (result) {
          const data = {
            ...result.data,
            // 把結果的 id_token 做解析
            idTokenDecode: jwtDecode(result.data.id_token),
          }

          this.setUserInfo(data)
          this.changeLoginStatus(true)
        }
      } catch (error) {
        this.changeLoginStatus(false)
        console.error(error)
        alert(error)
      }
    },

    async getNotifyToken() {
      try {
        console.log(this.$route.query)
        const param = Qs.stringify({
          grant_type: 'authorization_code',
          code: this.query.code,
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

    // 請求 Notify 授權
    async notifyEvent() {
      const result = await lineRedirectAPI(`${location.origin}/member/setting`)
      console.log(result)
      window.open(result, 'self')
      // let url = 'https://notify-bot.line.me/oauth/authorize?'

      // url += 'response_type=code'
      // // url += `&client_id=${process.env.VUE_APP_LINE_NOTIFY_CLIENT_ID}`
      // url += `&client_id=p8OqBWia6p1imkzQrjpsUs`
      // url += `&redirect_uri=${process.env.VUE_APP_LINE_REDIRECT_URL}` // 要接收回傳訊息的網址
      // url += `&state=${this.stateCode}`
      // url += '&scope=notify'

      // window.open(url, 'self')
    },
  },
}
</script>
