<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>錢包分析勝率</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="d-flex justify-center align-center flex-column">
        <h2 class="black--text mb-2">使用說明</h2>
        <img class="hidden-xs track mb-5" :src="addressProfitCover" alt="" />

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
                v-model="form.address"
                :rules="rules.address"
                label="錢包地址"
                required
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-dialog
                ref="dialog"
                v-model="dialog"
                :return-value.sync="form.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.date"
                    :rules="rules.date"
                    label="日期"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.date"
                  scrollable
                  :min="halfYearAgo"
                  :max="today"
                  locale="zh-TW"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(form.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" class="justify-center d-flex">
              <v-btn
                justify="center"
                color="cyan lighten-2 white--text"
                absoluteclass="mr-4"
                x-large
                @click="addressProfit"
              >
                開始分析
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <RecommendWalletList :headers="headers" :address-list="addressList" />
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations, mapActions } from 'vuex'
import { today, halfYearAgo } from '@/utils/time'
// API
import { registerAddressNotifyAPI, addressProfitAPI } from '@/api/user'
import RecommendWalletList from './components/RecommendWalletList.vue'

export default {
  name: 'AddressProfit',
  data() {
    return {
      today,
      halfYearAgo,
      addressProfitCover: require('@/assets/images/address-profit.png'),

      addressList: [],
      valid: false,
      dialog: false,
      form: {
        address: '',
        date: '',
      },

      headers: [
        {
          text: '聰明錢包',
          align: 'start',
          value: 'name',
        },
        { text: '推薦原因', value: 'memo' },
        { text: '錢包地址', value: '_id' },
      ],
      rules: {
        address: [
          (v) => !!v || '必填，請輸入錢包地址，不要輸入註記詞、你家住址',
        ],
        date: [
          (v) => !!v || '必填，請輸入時間，將會分析此時間到今日的錢包勝率',
        ],
      },

      captions: [
        {
          title: '錢包地址：',
          description: [
            {
              text: '例如「0x9f0e3df46531947056b771d231771c7198005a19」',
            },
          ],
        },
        {
          title: '日期',
          description: [
            {
              text: '請輸入分析日期，會從你選擇的日期到今日開始分析',
            },
          ],
        },
        {
          title: '功能說明：',
          description: [
            {
              text: '程式將會在你所設定的<span class="red--text">時間</span>到今日，進行錢包勝率分析，分析完成後會 Line 推播通知',
            },
            {
              text: '若日期拉得越長，需要稍等程式分析，並不會即時推播通知',
            },
            {
              text: '可參考聰明錢包清單，貼上你想分析的大佬錢包地址',
            },
            {
              text: '日期選 2021/12/1，程式將會分析 2021/12/1 至今日的勝率、報酬率等資訊',
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
            text: `訂閱 ${name} 錢包成功`,
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

    async addressProfit() {
      try {
        const isValid = await this.$refs.form.validate()
        if (!isValid) {
          this.showError('表單還有些項目還沒有填寫喔')
          return
        }
        if (!this.notify) {
          this.showError('請先至「推播設定」，同意Line推播後，才可使用功能')
          return
        }
        console.error('this.apiParams', this.apiParams)

        this.setParams()

        const params = {
          ...this.apiParams,
          address: this.form.address,
          start_date: this.form.date,
        }

        delete params.user_id
        const { data } = await addressProfitAPI(params)

        console.log(data)
        if (data.msg === 'ok') {
          this.showAlert({
            show: true,
            text: `已送出你的請求，請留意 Line 將會推播此錢包的分析`,
            type: 'success',
          })
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
