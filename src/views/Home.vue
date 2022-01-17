<template>
  <div class="h-100">
    <Info v-if="isLogin" />

    <div class="h-100" v-else>
      <v-row
        class="h-100"
        justify="center"
        align-content="center"
        align="center"
      >
        <v-col cols="8">
          <v-card elevation="2">
            <v-card-title class="text-body-2">
              追蹤 Opensea NFT 地板神器，使用前請先登入
            </v-card-title>
            <v-alert type="error">請先點擊右上角Line登入</v-alert>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// Utils
import { mapState } from 'vuex'
// Components
import Info from '@/views/Member/Info'

export default {
  name: 'Home',
  components: {
    Info,
  },

  computed: {
    ...mapState(['isLogin']),
  },
}
</script>
