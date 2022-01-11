<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <v-toolbar-title>
        <router-link :to="{ name: 'Home' }">HoyaWolf</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <line-button @click="loginEvent()"></line-button>
      ]
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>訊息推播</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// Component
import LineButton from '@/components/LineButton'

export default {
  name: 'App',
  components: { LineButton },

  data: () => ({}),

  methods: {
    loginEvent() {
      // 必填
      let loginUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
      loginUrl += 'response_type=code'
      loginUrl += `&client_id=${process.env.VUE_APP_LINE_CHANNEL_ID}`
      loginUrl += `&redirect_uri=${process.env.VUE_APP_LINE_REDIRECT_URL}` // 要接收回傳訊息的網址
      loginUrl += '&state=bff10f539a160bc044304007f2a5d8d0'
      loginUrl += '&scope=openid%20profile'
      // 選填
      loginUrl += '&nonce=helloWorld'
      loginUrl += '&prompt=consent'
      loginUrl += '&max_age=3600'
      loginUrl += '&ui_locales=zh-TW'
      loginUrl += '&bot_prompt=normal'
      console.error(loginUrl)
      window.open(loginUrl, '_self') // 轉跳到該網址
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
