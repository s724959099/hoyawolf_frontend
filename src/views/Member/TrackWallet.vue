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
                v-model="form.name"
                :rules="rules.name"
                label="錢包名稱"
                required
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.address"
                :rules="rules.address"
                label="錢包地址"
                required
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.memo" label="錢包描述" required />
            </v-col>

            <v-col cols="12" class="justify-center d-flex">
              <v-btn
                justify="center"
                color="cyan lighten-2 white--text"
                absoluteclass="mr-4"
                x-large
                @click="registerAddressNotify"
              >
                訂閱
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <RecommendWalletList :address-list="addressList" />

    <!-- 項目 -->
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card elevation="2" class="pa-10">
          <v-card-title>已追蹤的 NFT 聰明錢包</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-data-table
            :headers="headers"
            :items="addressTrack"
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
                @click="deleteAddressNotify(item.name, item._id)"
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
  deleteAddressNotifyAPI,
  registerAddressNotifyAPI,
} from '@/api/user'
import RecommendWalletList from './components/RecommendWalletList.vue'

export default {
  name: 'MemberTrackWallet',
  data() {
    return {
      addressList: [],
      valid: false,
      form: {
        address: '',
        name: '',
        memo: '',
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
        name: [(v) => !!v || '錢包名稱為必填，輸入你好辨識的名稱，可任意取名'],
        address: [(v) => !!v || '錢包地址為必填'],
      },
    }
  },
  computed: {
    ...mapState([
      'footerProps',
      'isLogin',
      'info',
      'notify',
      'addressTrack',
      'apiParams',
    ]),
  },

  async mounted() {
    await this.checkNotifyTokenThenGetData()
    this.getRecommendWallet()
  },

  methods: {
    ...mapMutations({
      checkNotifyTokenThenGetData: 'CHECK_NOTIFY_TOKEN',
      setParams: 'SET_PARAMS',
    }),

    ...mapActions([
      'showAlert',
      'showError',
      'getUserOrderItem',
      'getRecommendWallet',
    ]),

    // 訂閱 Opensea 錢包推播
    async registerAddressNotify() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) return

      this.setParams()

      const params = {
        ...this.apiParams,
        address: this.form.address,
        name: 'Tony 錢包',
        memo: '一起Hoya',
      }

      this.$error(JSON.stringify(params))
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
        const { data } = await deleteAddressNotifyAPI(id)
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
  components: { RecommendWalletList },
}
</script>

<style></style>
