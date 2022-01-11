<template>
  <v-card elevation="2">
    <div class="about">
      <h1>Receive Page</h1>
      <h3>回傳回來的值：{{ query }}</h3>
      <hr />
      <h1>Token API</h1>
      <h3>回傳回來的值: {{ tokenResult }}</h3>
      <hr />
      <h1>IdToken Decode</h1>
      <h3>解析後的值: {{ idTokenDecode }}</h3>
      <hr />
    </div>
  </v-card>
</template>

<script>
// Utils
import Qs from 'qs'
import jwtDecode from 'jwt-decode'
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
    if (this.$route.query) this.getData()
  },

  methods: {
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

        if (result) {
          this.tokenResult = result.data
          // 把結果的 id_token 做解析
          this.idTokenDecode = jwtDecode(result.data.id_token)
        }
      } catch (error) {
        alert(error)
      }
    },
  },
}
</script>
