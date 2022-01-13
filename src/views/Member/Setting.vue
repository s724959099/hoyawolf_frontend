<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>Opensea 地板價主動通知</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          {{ info.idTokenDecode.name }}，歡迎使用 Hoya 工具
        </div>
        <v-avatar>
          <img
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
import { mapState, mapMutations } from 'vuex'
// API
import { getLineAccessTokenAPI, getNotifyAccessTokenAPI } from '@/api/line'

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
    if (this.query && !this.isLogin) this.getData()
  },

  computed: {
    ...mapState(['isLogin', 'info']),
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
  },
}
</script>
