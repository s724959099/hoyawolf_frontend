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
// API
import { lineRedirectAPI, getNotifyAccessTokenAPI } from '@/api/line'

export default {
  name: 'MemberNotify',
  data() {
    return {}
  },

  methods: {
    // [Step1] 請求 Notify 授權
    async notifyEvent() {
      const result = await lineRedirectAPI(`${location.origin}/member/notify`)
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

    async step1() {
      // response_type=code&scope=notify&response_mode=form_post&client_id=<放上你的Client_id>&redirect_uri=<放上你的RedirectURI>&state=<放一個隨機產生的亂碼>
      let loginUrl = 'https://notify-bot.line.me/oauth/authorize?'
      loginUrl += 'response_type=code'
      loginUrl += `&client_id=${process.env.VUE_APP_LINE_NOTIFY_CLIENT_ID}`
      loginUrl += `&redirect_uri=${process.env.VUE_APP_LINE_NOTIFY_REDIRECT_URL}`
      loginUrl += `&scope=notify`
      loginUrl += `&state=bff10f539a160bc044304007f2a5d8d0`

      window.open(loginUrl, '_self') // 轉跳到該網址
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
