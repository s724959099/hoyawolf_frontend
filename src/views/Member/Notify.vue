<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>連結 Line Notify</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          追蹤喜愛的 NFT 項目、聰明錢包，價格或動作觸發時主動用 Line 通知
        </div>
        <div v-if="!notify" class="text-center">
          <v-btn
            color="cyan lighten-2 white--text"
            x-large
            elevation="2"
            @click="lineRedirect"
            >開啟Line通知
          </v-btn>
        </div>
        <div v-else class="d-flex justify-center align-center flex-column">
          <v-btn disabled elevation="2">你已成功開啟Line推播</v-btn>
          <v-card-text class="text-center">
            接下來你可以到這些地方開始使用功能
          </v-card-text>
          <div>
            <router-link :to="{ name: 'MemberInfo' }" class="mr-3">
              <v-btn color="cyan lighten-2 white--text" elevation="2">
                NFT追蹤
              </v-btn>
            </router-link>
            <router-link :to="{ name: 'MemberTrackWallet' }" class="mr-3">
              <v-btn color="red white--text" elevation="2">錢包追蹤</v-btn>
            </router-link>
            <router-link :to="{ name: 'AddressProfit' }">
              <v-btn color="red white--text" elevation="2">錢包分析</v-btn>
            </router-link>
          </div>
        </div>
        <v-btn
          color="blue white--text"
          v-if="info.idTokenDecode.name === 'Hazel'"
          @click="sendNotifyToUser"
          class="mt-5"
          elevation="2"
          >測試Line推播</v-btn
        >
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
        message: 'coolman',
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
