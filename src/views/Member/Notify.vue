<template>
  <v-container>
    <v-card elevation="2" class="pa-10">
      <v-card-title>連結 Line Notify</v-card-title>
      <v-divider class="mx-4"></v-divider>

      <v-card-text class="d-flex justify-center align-center flex-column">
        <div class="text-center gray--text mt-3 mb-3">
          追蹤喜愛的 NFT 項目，價格觸發時主動用 Line 通知
        </div>
        <v-btn
          v-if="!notify"
          color="cyan lighten-2 white--text"
          x-large
          elevation="2"
          @click="lineRedirect"
          >開啟Line通知
        </v-btn>
        <v-btn v-else disabled elevation="2">已開啟Line推播</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// Utils
import { mapState, mapMutations } from 'vuex'
// API
import { lineRedirectAPI } from '@/api/line'

export default {
  name: 'MemberNotify',
  data() {
    return {
      query: {},
    }
  },

  computed: {
    ...mapState(['isLogin', 'info', 'notify']),
  },

  mounted() {
    if (this.$route.query.access_token) {
      this.setNotify(this.$route.query.access_token)
      this.$router.push(this.$route.path)
    }
  },

  methods: {
    ...mapMutations({
      setNotify: 'SET_NOTIFY',
    }),

    // [Step1] 請求 Notify 授權
    async lineRedirect() {
      window.open(lineRedirectAPI(`${location.origin}/member/auth`))
    },
  },
}
</script>

<style></style>
