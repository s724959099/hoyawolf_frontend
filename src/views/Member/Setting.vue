<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>帳號設定 - 連結 Line</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          <span v-if="info.idTokenDecode && info.idTokenDecode.name">
            {{ info.idTokenDecode.name }}，
          </span>
          歡迎使用 Hoya 追蹤 Opensea 工具<br />
          登入後請先到設定推播，允許 Line 機器人發送推播給你
        </div>
        <div class="mt-3 mb-3">
          <v-btn color="cyan lighten-2 white--text" elevation="2">
            <router-link :to="{ name: 'MemberNotify' }"> 設定推播 </router-link>
          </v-btn>
        </div>
        <v-avatar>
          <img
            v-if="info.idTokenDecode && info.idTokenDecode.picture"
            :src="info.idTokenDecode.picture"
            :alt="info.idTokenDecode.name"
          />
        </v-avatar>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import Qs from 'qs'
import jwtDecode from 'jwt-decode'
import LogRocket from 'logrocket'
import { mapState, mapMutations, mapActions } from 'vuex'
// API
import { getLineAccessTokenAPI } from '@/api/line'

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
    if (
      Object.keys(this.$route.query).length !== 0 &&
      !this.isLogin &&
      Object.keys(this.info).length === 0
    ) {
      this.getData()
    }
  },

  computed: {
    ...mapState(['isLogin', 'info']),
  },

  methods: {
    ...mapMutations({
      changeLoginStatus: 'CHANGE_LOGIN',
      setUserInfo: 'SET_USER_INFO',
    }),
    ...mapActions(['showAlert', 'showError']),

    // 請求使用者資料，接網址的參數
    async getData() {
      try {
        this.query = this.$route.query

        const params = Qs.stringify({
          grant_type: 'authorization_code',
          code: this.query.code,
          redirect_uri: process.env.VUE_APP_LINE_REDIRECT_URL,
          client_id: process.env.VUE_APP_LINE_CHANNEL_ID,
          client_secret: process.env.VUE_APP_LINE_CHANNEL_SECRET,
        })

        this.$error(params)
        const result = await getLineAccessTokenAPI(params)
        if (result) {
          const data = {
            ...result.data,
            // 把結果的 id_token 做解析
            idTokenDecode: jwtDecode(result.data.id_token),
          }

          this.setUserInfo(data)
          this.changeLoginStatus(true)

          LogRocket.identify(data.idTokenDecode.sub, {
            name: data.idTokenDecode.name,
            email: data.idTokenDecode.picture,
          })
        }
      } catch (error) {
        this.changeLoginStatus(false)
        this.$error(error)
        this.showError(error)
      }
    },
  },
}
</script>
