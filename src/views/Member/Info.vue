<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>Opensea 追蹤清單</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          你已追蹤的 NFT 項目，下個百倍 NFT 是誰
        </div>
        <v-btn
          color="cyan lighten-2 white--text"
          large
          elevation="2"
          @click="registerOpenseaNotify"
        >
          取得所有訂閱資訊
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 項目 -->
    <v-row>
      <v-col cols="6" v-for="item in items" :key="item">
        <v-card class="mt-10 pa-5">
          <v-card-title>{{ item.collection }}</v-card-title>
          <v-btn
            color="cyan lighten-2 white--text"
            x-large
            elevation="2"
            @click="getUserInfo"
          >
            訂閱
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations } from 'vuex'
// API
import { getUserInfoAPI, registerOpenseaNotifyAPI } from '@/api/user'

export default {
  name: 'MemberInfo',
  data() {
    return {
      items: [
        {
          collection: 'hoyawolf',
        },
      ],
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    // this.getUserInfo()
  },

  methods: {
    ...mapMutations({
      setNotify: 'SET_NOTIFY',
    }),

    // 取得使用者所有訂閱項目
    async getUserInfo() {
      const result = await getUserInfoAPI(this.info.idTokenDecode.sub)
      console.log(result)
    },

    async registerOpenseaNotify(collection) {
      const params = {
        collection,
        user_id: this.info.idTokenDecode.sub,
        access_token: this.notify,
      }
      console.log(params)
      // {
      //   "collection": "hoyawolf",
      //   "user_id": "U8ea71e5a0df64962455326cf855ff72b",
      //   "access_token": "CyfKxO3lhJB7iZxKEtEO7fLNJShbl8bPqBKxtULAocR"
      // }
      const result = await registerOpenseaNotifyAPI(params)
      console.log(result)
    },
  },
}
</script>

<style></style>
