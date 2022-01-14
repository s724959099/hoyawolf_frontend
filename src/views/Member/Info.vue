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
          @click="getUserOrderItem"
        >
          取得所有追蹤資訊
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 項目 -->
    <v-row>
      <!-- <v-col cols="6" v-for="item in opensea" :key="item">
        <v-card class="mt-10 pa-5">
          <v-card-title>{{ item.name }}</v-card-title>
          <v-btn
            color="cyan lighten-2 white--text"
            large
            elevation="2"
            @click="registerOpenseaNotify(item.collection)"
          >
            訂閱
          </v-btn>
        </v-card>
      </v-col> -->
      <v-col cols="6" v-for="item in opensea" :key="item">
        <v-card class="mt-10 pa-5">
          <v-card-title>{{ item.name }}</v-card-title>
          <v-btn
            color="cyan lighten-2 white--text"
            large
            elevation="2"
            @click="deleteOpenseaNotify(item._id)"
          >
            取消訂閱
          </v-btn>
          <div class="text-center gray--text mt-3 mb-3">
            當價格高於 {{ item.higher_price }} 時通知<br />
            當價格低於 {{ item.lower_price }} 時通知
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations } from 'vuex'
// API
import {
  deleteUserAPI,
  getUserInfoAPI,
  registerOpenseaNotifyAPI,
} from '@/api/user'

export default {
  name: 'MemberInfo',
  data() {
    return {
      items: [
        {
          collection: 'hoyawolf',
        },
      ],
      opensea: {},
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  methods: {
    ...mapMutations({
      setNotify: 'SET_NOTIFY',
    }),

    // 取得使用者所有訂閱項目
    async getUserOrderItem() {
      try {
        const { data } = await getUserInfoAPI(this.info.idTokenDecode.sub)
        this.opensea = data.opensea
      } catch (error) {
        console.error(error)
      }
    },

    async registerOpenseaNotify({ name, lower_price, higher_price }) {
      const params = {
        collection: name,
        user_id: this.info.idTokenDecode.sub,
        access_token: this.notify,
        lower_price: lower_price,
        higher_price: higher_price,
      }

      const result = await registerOpenseaNotifyAPI(params)
      console.log(result)
    },

    // 取消訂閱
    async deleteOpenseaNotify(id) {
      await deleteUserAPI(id)
    },
  },
}
</script>

<style></style>
