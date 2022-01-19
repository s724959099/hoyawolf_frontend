<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>開始追蹤喜愛的 聰明錢包</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <!-- Form -->
      <v-form v-model="valid" ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.collection"
                :rules="rules.name"
                label="NFT名稱"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="justify-center d-flex">
              <v-btn
                justify="center"
                color="cyan lighten-2 white--text"
                absoluteclass="mr-4"
                x-large
                @click="registerOpenseaNotify"
              >
                訂閱
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <!-- 項目 -->
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card elevation="2" class="pa-10">
          <v-card-title>已追蹤的 NFT 聰明錢包</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-data-table
            :headers="headers"
            :items="opensea"
            :items-per-page="10"
            class="elevation-2 mb-10"
            :footer-props="footerProps"
            id="owner-data-table"
          >
            <template v-slot:item.url="{ item }">
              <a :href="item.url" target="_blank" rel="noopener noreferrer"
                >Opensea</a
              >
            </template>

            <template v-slot:item.action="{ item }">
              <v-btn
                color="red lighten-2 white--text"
                elevation="2"
                @click="deleteOpenseaNotify(item.name, item._id)"
              >
                取消訂閱
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations, mapActions } from 'vuex'
// API
import {
  getAddresssRecommendAPI,
  addAddresssRecommendAPI,
  deleteAddresssRecommendAPI,
  registerAddressNotifyAPI,
} from '@/api/user'

export default {
  name: 'MemberTrackWallet',
  data() {
    return {
      addressList: [],
      valid: false,
      form: {
        collection: '',
      },

      headers: [
        {
          text: '項目名稱',
          align: 'start',
          value: 'name',
        },
        { text: '最低價', value: 'lower_price' },
        { text: '最高價', value: 'higher_price' },
        { text: 'Opensea', value: 'url', sortable: false },
        { text: '動作', value: 'action', sortable: false },
      ],

      rules: {
        name: [(v) => !!v || '項目名稱為必填，請參考上述說明'],
      },
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    if (this.info.idTokenDecode.sub) {
      this.getRecommendWallet()
    } else {
      const alert = {
        show: true,
        text: '請先至「推播設定」，同意Line推播後，才可使用功能',
        type: 'warning',
      }
      this.showAlert(alert)
    }
  },

  methods: {
    ...mapActions(['showAlert', 'showError']),

    // 取得推薦錢包
    async getRecommendWallet() {
      try {
        const { data } = await getAddresssRecommendAPI()
        this.addressList = data
      } catch (error) {
        this.$error(error)
      }
    },

    // 訂閱 Opensea 錢包推播
    async registerAddressNotify() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) return

      const params = {
        address: '0x7c607f8aa9e2b8aa7802650060165b7b36ca081f',
        user_id: 'DEMO',
        access_token: 'yLhQXmexl19M0ogNzVdFxPGAk9et0Lmj4dxXDMlLaIe',
        name: 'Tony 錢包',
        memo: '一起Hoya',
      }

      try {
        const { data } = await registerAddressNotifyAPI(params)

        if (data.msg === 'register success') {
          this.showAlert({
            show: true,
            text: `訂閱 ${this.form.collection} 錢包成功`,
            type: 'success',
          })

          // 重新取得資料
          this.getUserOrderItem()
          this.resetForm()
        } else {
          this.showError(data.msg)
        }
      } catch (error) {
        this.$error(error)
      }
    },

    // 取消追蹤聰明錢包
    async deleteAddressNotify(name, id) {
      try {
        const { data } = await deleteAddresssRecommendAPI(id)

        if (data.msg === 'sucess') {
          this.showAlert({
            show: true,
            text: `${name} 取消成功，將不再通知`,
            type: 'success',
          })
          // 重新請求 API
          this.getUserOrderItem()
        }
      } catch (error) {
        this.$error(error)
        this.showError(error)
      }
    },

    // 重置表單
    resetForm() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style></style>
