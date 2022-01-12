<template>
  <v-app id="inspire">
    <v-app-bar app color="white" dark>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="48">
          <router-link :to="{ path: '/' }">
            <img :src="logo" />
          </router-link>
        </v-avatar>

        <v-spacer></v-spacer>

        <v-btn v-if="!isLogin" elevation="2" @click="loginEvent()"
          >Line登入
        </v-btn>

        <div v-if="isLogin" @click.stop="drawer = !drawer" v-if="isLogin">
          <v-icon large color="cyan lighten-2">
            mdi-message-alert-outline
          </v-icon>
          <!-- <v-avatar v-bind="attrs" v-on="on">
            :src="info.idTokenDecode.picture"
            <img :src="logo" :alt="info.name" />
          </v-avatar> -->
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute right temporary>
      <v-list nav dense>
        <v-subheader>選單</v-subheader>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <router-link :to="{ name: 'MemberSetting' }">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-message-alert-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'設定推播'"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>

          <v-list-item @click="signOut">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'登出'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="lighten-3">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// Utils
import { mapState } from 'vuex'

export default {
  name: 'App',

  data: () => ({
    stateCode: 'bff10f539a160bc044304007f2a5d8d0',
    drawer: null,
    logo: require('./assets/images/hoyawolf-logo.png'),
    group: null,
  }),

  watch: {
    group() {
      this.drawer = false
    },
  },

  computed: {
    ...mapState(['isLogin', 'info']),
  },

  methods: {
    // 請求登入授權
    loginEvent() {
      // 必填
      let loginUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
      loginUrl += 'response_type=code'
      loginUrl += `&client_id=${process.env.VUE_APP_LINE_CHANNEL_ID}`
      loginUrl += `&redirect_uri=${process.env.VUE_APP_LINE_REDIRECT_URL}` // 要接收回傳訊息的網址
      loginUrl += `&state=${this.stateCode}`
      loginUrl += '&scope=openid%20profile'
      // 選填
      loginUrl += '&nonce=helloWorld'
      loginUrl += '&prompt=consent'
      loginUrl += '&max_age=3600'
      loginUrl += '&ui_locales=zh-TW'
      loginUrl += '&bot_prompt=normal'

      window.open(loginUrl, '_self') // 轉跳到該網址
    },

    // 登出
    signOut() {},
  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
