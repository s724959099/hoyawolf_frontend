<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>錢包分析勝率</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="d-flex justify-center align-center flex-column">
        <h2 class="black--text mb-2">查詢結果</h2>

        <v-divider class="mx-4"></v-divider>

        <div class="caption" v-if="resData && resData.data">
          <ul>
            <li class="cyan--text subtitle-1">
              查詢時間 {{ transferDateTime(resData.data.start_date) }}
              至
              {{ transferDateTime(today) }}
            </li>
            <li class="cyan--text subtitle-1">
              查詢的錢包地址：{{ resData.data.address }}
            </li>
          </ul>
          <div class="mt-5 subtitle-1 white-pre" v-html="resData.result"></div>
        </div>

        <div v-else>
          <h2 class="black--text subtitle-1">很抱歉，查無資料</h2>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations, mapActions } from 'vuex'
import { today, transferDateTime } from '@/utils/time'
// API
import { addressProfitResultAPI } from '@/api/user'

export default {
  name: 'AddressProfit',
  data() {
    return {
      today,
      valid: false,
      dialog: false,
      resData: {},

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
    // await this.checkNotifyTokenThenGetData()
    await this.getAddressProfitResult()
  },

  methods: {
    ...mapMutations({
      checkNotifyTokenThenGetData: 'CHECK_NOTIFY_TOKEN',
      setParams: 'SET_PARAMS',
    }),

    ...mapActions(['showAlert', 'showError']),

    // 註冊追蹤錢包
    async getAddressProfitResult() {
      try {
        const { data } = await addressProfitResultAPI(this.$route.params.id)
        if (data && Object.keys(data).length > 0) {
          this.resData = data
        } else {
          this.showError('查無資料')
        }
      } catch (error) {
        this.$error(error)
      }
    },

    transferDateTime,
  },
}
</script>

<style></style>
