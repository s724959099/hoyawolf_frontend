<template>
  <v-row class="mt-5">
    <v-col cols="12">
      <v-card elevation="2" class="pa-10">
        <v-card-title>推薦聰明錢包清單</v-card-title>
        <v-divider class="mx-4"></v-divider>

        <v-card-text class="d-flex justify-center align-center flex-column">
          <div class="text-center gray--text mt-3 mb-3">
            <span class="subtitle-2 black--text"
              >想提供聰明錢包清單嗎？請左轉至
              <a class="red--text" :href="discord">DC群-工程狼頻道提供</a>
            </span>
          </div>
        </v-card-text>
        <v-data-table
          :headers="headers"
          :items="recommendAddressList"
          :items-per-page="10"
          class="elevation-2 mb-10"
          :footer-props="footerProps"
        >
          <template v-slot:item.action="{ item }">
            <v-btn
              color="red lighten-2 white--text"
              elevation="2"
              @click="registerAddressNotify(item)"
            >
              訂閱
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// Utils
import { mapState, mapActions, mapMutations } from 'vuex'
// API
import { registerAddressNotifyAPI } from '@/api/user'

export default {
  props: {
    addressList: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },

  computed: {
    ...mapState([
      'isLogin',
      'info',
      'notify',
      'footerProps',
      'recommendAddressList',
      'addressTrack',
    ]),
  },

  data: () => ({
    discord:
      'https://discord.com/channels/910572490462490685/933304450179797005/933305426869620797',
  }),

  methods: {
    ...mapMutations({
      checkNotifyToken: 'CHECK_NOTIFY_TOKEN',
    }),

    ...mapActions(['showAlert', 'showError', 'getUserOrderItem']),

    async registerAddressNotify({ _id, name, memo }) {
      if (!this.notify) {
        this.showError('請先至「推播設定」，同意Line推播後，才可使用功能')
        return
      }

      const params = {
        address: _id,
        user_id: this.info.idTokenDecode.sub,
        access_token: this.notify,
        name,
        memo,
      }

      this.$log(JSON.stringify(params))

      try {
        const { data } = await registerAddressNotifyAPI(params)

        if (data.msg === 'register success') {
          this.showAlert({
            show: true,
            text: `訂閱 ${name} 成功`,
            type: 'success',
          })
          // 重新取得資料
          this.getUserOrderItem()
        }
      } catch (error) {
        this.$error(error.response)
      }
    },
  },
}
</script>

<style></style>
