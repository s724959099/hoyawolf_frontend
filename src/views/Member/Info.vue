<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>開始追蹤喜愛的 NFT 項目</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="d-flex justify-center align-center flex-column">
        <h2 class="black--text mb-2">使用說明</h2>
        <v-divider class="mx-4"></v-divider>
        <div>
          <span class="subtitle-2 black--text">
            NFT名稱：請填寫opensea網址最後一截單字
          </span>
          <ul>
            <li>
              例如網址是 https://opensea.io/collection/
              <strong class="red--text">hoyawolf</strong>
              ，NFT名稱填「hoyawolf」
            </li>
          </ul>
          <span class="subtitle-2 black--text">
            最低價格：當項目低於某價格，將推播通知
          </span>
          <ul>
            <li>
              若想要追蹤
              <span class="red--text">hoyawolf</span>
              opensea價格<strong class="red--text">低於 1.6</strong>
              ，則設定最低價格 1.6，當價格低於 1.6 將通知
            </li>
          </ul>
          <span class="subtitle-2 black--text">
            最高價格：當項目高於某價格，將推播通知
          </span>
          <ul>
            <li>
              若想要追蹤
              <span class="red--text">hoyawolf</span>
              opensea價格<strong class="red--text">高於 2.5</strong>
              ，則設定最高價格 2.5，當價格超過 2.5 將通知
            </li>
            <li>
              最低、最高價為選填，若皆不設定，每五分鐘監聽，Opensea有變動會Line推播
            </li>
          </ul>
        </div>
      </v-card-text>

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

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.lower_price"
                label="價格低於多少時推播"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.higher_price"
                label="價格高於多少時推播"
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
          <v-card-title>已追蹤的 NFT 項目</v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-data-table
            :headers="headers"
            :items="opensea"
            :items-per-page="10"
            class="elevation-2 mb-10"
            :footer-props="footerProps"
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
  deleteUserAPI,
  getUserInfoAPI,
  registerOpenseaNotifyAPI,
} from '@/api/user'

export default {
  name: 'MemberInfo',
  data() {
    return {
      opensea: [],
      valid: false,

      footerProps: {
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
        'items-per-page-text': '一頁幾筆',
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
      form: {
        collection: '',
        lower_price: null,
        higher_price: null,
      },

      rules: {
        name: [(v) => !!v || '項目名稱為必填，請參考上述說明'],
      },
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    this.$error('here')
    if (this.info.idTokenDecode.sub) {
      this.getUserOrderItem()
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
    ...mapMutations({
      setNotify: 'SET_NOTIFY',
    }),

    ...mapActions(['showAlert', 'showError']),

    // 取得使用者所有訂閱項目
    async getUserOrderItem() {
      try {
        const { data } = await getUserInfoAPI(this.info.idTokenDecode.sub)
        this.opensea = data.opensea || []

        if (this.opensea.length > 0) {
          this.opensea.forEach((item) => {
            item.action = true
            item.url = `https://opensea.io/collection/${item.name}`
          })
        }
      } catch (error) {
        this.$error(error)
      }
    },

    async registerOpenseaNotify() {
      const isValid = await this.$refs.form.validate()
      if (!isValid) return
      if (!this.notify) {
        this.showError('請先至「推播設定」，同意Line推播後，才可使用功能')
        return
      }

      let params = {
        collection: this.form.collection,
        user_id: this.info.idTokenDecode.sub,
        access_token: this.notify,
        lower_price: parseFloat(this.form.lower_price),
        higher_price: parseFloat(this.form.higher_price),
      }

      // 檢查參數
      Object.keys(params).forEach((item) => {
        !params[item] && delete params[item]
      })

      this.$log(JSON.stringify(params))

      try {
        const { data } = await registerOpenseaNotifyAPI(params)

        if (data.msg === 'register success') {
          this.showAlert({
            show: true,
            text: `訂閱 ${this.form.collection} 成功`,
            type: 'success',
          })

          // 重新取得資料
          this.getUserOrderItem()
          this.resetForm()
        }

        if (data.detail && data.detail.errors) {
          let string = ''
          debugger
          data.detail.errors.forEach((error) => {
            string += `${error.loc[1]} ${error.msg} <br>`
          })
          this.$error(string)
          this.showError(string)
        }
      } catch (error) {
        this.$error(error)
        this.showError(error)
      }
    },

    // 取消訂閱
    async deleteOpenseaNotify(name, id) {
      try {
        const { data } = await deleteUserAPI(id)

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

    resetForm() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style></style>
