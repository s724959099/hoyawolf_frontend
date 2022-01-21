<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>連結 Line Notify</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          追蹤喜愛的 NFT 項目、聰明錢包，價格或動作觸發時主動用 Line 通知
        </div>
        <v-btn
          v-if="!notify"
          color="cyan lighten-2 white--text"
          x-large
          elevation="2"
          @click="lineRedirect"
          >開啟Line通知
        </v-btn>
        <v-btn v-else disabled elevation="2">你已成功開啟Line推播</v-btn>
        <v-btn @click="sendNotifyToUser" elevation="2">測試Line推播</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import Qs from 'qs'
import { mapState, mapMutations } from 'vuex'
// API
import { lineRedirectAPI, sendNotifyToUserAPI } from '@/api/line'

export default {
  name: 'MemberNotify',
  data() {
    return {
      query: {},
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    if (this.$route.query.access_token) {
      this.setNotify(this.$route.query.access_token)
      // this.$router.push(this.$route.path)
    }
  },

  methods: {
    ...mapMutations({
      setNotify: 'SET_NOTIFY',
    }),

    // [Step1] 請求 Notify 授權
    async lineRedirect() {
      window.open(lineRedirectAPI(`${location.origin}/member/auth`))
    },

    async sendNotifyToUser() {
      const params = Qs.stringify({
        message: 'cool',
      })

      const { data } = await sendNotifyToUserAPI(params)

      if (data.msg === 'ok') {
        this.showAlert({
          show: true,
          text: `推播成功`,
          type: 'success',
        })
      }
    },
  },
}
</script>

<style></style>
