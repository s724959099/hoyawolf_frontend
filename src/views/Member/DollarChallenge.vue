<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>追蹤Tony Bybit 交易所下單</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="d-flex justify-center align-center flex-column">
        <h2 class="black--text mb-2">即時 Line 通知進場、出場</h2>

        <div class="mb-3">
          ##
          從300萬本金操作到1000萬的男人Tony，投報率將近300％，好奇他是怎麼做到的嗎？快來使用Bybit下單追蹤神器，掌握Tony第一時間的下單點位，止盈止損、槓桿倍數、倉位大小一次報給你知道！
        </div>

        <v-divider class="mx-4"></v-divider>
        <div>
          <v-btn
            justify="center"
            color="cyan lighten-2 white--text"
            absoluteclass="mr-4"
            class="mr-3"
            @click="registerBybitNotify"
            :disabled="hasBybitNotify"
          >
            {{ hasBybitNotify ? '訂閱' : '已訂閱' }}
          </v-btn>
          <v-btn
            v-if="hasBybitNotify"
            justify="center"
            color="red lighten-2 white--text"
            absoluteclass="mr-4"
            @click="deleteBybitNotify"
          >
            取消訂閱
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations, mapActions } from 'vuex'
// API
import {
  deleteBybitNotifyAPI,
  registerBybitNotifyAPI,
  checkBybitNotifyAPI,
} from '@/api/user'

export default {
  name: 'DollarChallenge',
  data() {
    return {
      hasBybitNotify: false,
    }
  },
  computed: {
    ...mapState(['isLogin', 'info', 'notify', 'addressTrack', 'apiParams']),
  },

  async mounted() {
    await this.checkNotifyTokenThenGetData()
    await this.checkBybitNotify()
  },

  methods: {
    ...mapMutations({
      checkNotifyTokenThenGetData: 'CHECK_NOTIFY_TOKEN',
      setParams: 'SET_PARAMS',
    }),

    ...mapActions(['showAlert', 'showError']),

    async checkBybitNotify() {
      try {
        this.setParams()

        const { data } = await checkBybitNotifyAPI(this.apiParams.user_id)

        this.hasBybitNotify = data && Object.keys(data).length > 0
      } catch (error) {
        this.$error(error)
        this.showError(error)
      }
    },

    // 訂閱交易所通知
    async registerBybitNotify() {
      if (!this.notify) {
        this.showError('請先至「推播設定」，同意Line推播後，才可使用功能')
        return
      }

      this.setParams()

      const params = {
        ...this.apiParams,
      }

      console.log('params', params)

      try {
        const { data } = await registerBybitNotifyAPI(params)
        if (data) {
          this.showAlert({
            show: true,
            text: `訂閱成功，Tony在Bybit有任何風吹草動皆會Line通知`,
            type: 'success',
          })
          this.checkBybitNotify()
        } else {
          this.showError(data.msg)
        }
      } catch (error) {
        this.$error(error)
      }
    },

    // 取消訂閱 Bybit Tony 下單
    async deleteBybitNotify() {
      try {
        this.setParams()

        const { data } = await deleteBybitNotifyAPI(this.apiParams.user_id)
        if (data.msg === 'ok') {
          this.showAlert({
            show: true,
            text: `取消成功，將不再通知 Bybit 下單`,
            type: 'success',
          })
        }

        if (data.msg === 'not found') {
          this.showAlert({
            show: true,
            text: `發生錯誤，查無資料`,
            type: 'error',
          })
        }
      } catch (error) {
        this.$error(error)
        this.showError(error)
      }
    },
  },
}
</script>

<style></style>
