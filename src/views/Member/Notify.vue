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
// API
import { lineRedirectAPI } from '@/api/line'

export default {
  name: 'MemberNotify',
  data() {
    return {}
  },

  methods: {
    // 請求 Notify 授權
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
  },
}
</script>

<style></style>
