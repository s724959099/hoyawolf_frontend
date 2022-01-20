<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>大戶地址追蹤神器</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="d-flex justify-center align-center flex-column">
        <h2 class="black--text mb-2">使用說明</h2>
        <img class="hidden-xs track mb-5" :src="addressTrackImg" alt="" />

        <v-divider class="mx-4"></v-divider>

        <div class="caption">
          <div v-for="caption in captions" :key="caption.title">
            <span class="subtitle-2 black--text">{{ caption.title }}</span>
            <ul>
              <li
                v-for="(item, index) in caption.description"
                :key="index"
                v-html="item.text"
              />
            </ul>
          </div>
        </div>
      </v-card-text>

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
              <v-text-field
                v-model="form.memo"
                placeholder="是一個 memo，可任意輸入文字，可輸入推薦追蹤原因"
                label="錢包描述"
                required
              />
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

    <RecommendWalletList :headers="headers" :address-list="addressList" />

    <!-- 項目 -->
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card elevation="2" class="pa-10">
          <v-card-title>已追蹤地址</v-card-title>
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
  // getAddresssRecommendAPI,
  // addAddresssRecommendAPI,
  // deleteAddresssRecommendAPI,
  deleteAddressNotifyAPI,
  registerAddressNotifyAPI,
} from '@/api/user'
import RecommendWalletList from './components/RecommendWalletList.vue'

export default {
  name: 'MemberTrackWallet',
  data() {
    return {
      addressTrackImg: require('@/assets/images/address-track.png'),

      addressList: [],
      valid: false,
      form: {
        address: '',
        name: '',
        memo: '',
      },

      headers: [
        {
          text: '聰明錢包',
          align: 'start',
          value: 'name',
        },
        { text: '推薦原因', value: 'memo' },
        // { text: 'Opensea', value: 'url', sortable: false },
        { text: '動作', value: 'action', sortable: false },
      ],
      rules: {
        name: [(v) => !!v || '必填，輸入你好辨識的名稱，可任意取名'],
        address: [
          (v) => !!v || '必填，是一個 memo，可任意輸入文字，可輸入推薦追蹤原因',
        ],
      },

      captions: [
        {
          title: '錢包名稱：',
          description: [
            {
              text: '因錢包地址太長串不好辨識，你可以任意取名你喜歡的名稱以辨識使用',
            },
          ],
        },
        {
          title: '錢包地址：',
          description: [
            {
              text: '例如「0x9f0e3df46531947056b771d231771c7198005a19」',
            },
          ],
        },
        {
          title: '錢包描述：',
          description: [
            {
              text: '是一個 memo，可任意輸入文字，可輸入推薦追蹤原因',
            },
          ],
        },
        {
          title: '觸發條件：',
          description: [
            {
              text: '程式將每<span class="red--text">五分鐘</span>排程監測，當大戶在Opensea上任何動作時，Line 會推播通知',
            },
            {
              text: '動作包含：買入、賣出、掛價、取消掛價、出價、取消出價、轉移',
            },
          ],
        },
      ],
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

    // 註冊追蹤錢包
    async registerAddressNotify() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) {
        this.showError('表單還有些項目還沒有填寫喔')
        return
      }
      if (!this.notify) {
        this.showError('請先至「推播設定」，同意Line推播後，才可使用功能')
        return
      }

      this.setParams()

      const { address, name, memo } = this.form

      const params = {
        ...this.apiParams,
        address,
        name,
        memo,
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
