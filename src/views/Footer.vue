<template>
  <v-footer dark padless>
    <v-card class="flex gray" flat tile>
      <v-card-text class="py-2 white--text text-center">
        <v-spacer></v-spacer>
        <div>
          <v-btn v-for="item in items" :key="item.url" class="mx-4" dark icon>
            <a :href="item.url" target="_blank">
              <v-icon size="24px">
                {{ item.icon }}
              </v-icon>
            </a>
          </v-btn>
        </div>
        {{ new Date().getFullYear() }} —
        <strong>工程狼 Meatball、Sula、Hazel、CWC 共同製作</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        icon: 'mdi-web',
        url: 'https://newecommerce.clickfunnels.com/optin1640080013393',
      },
      {
        icon: 'mdi-youtube',
        url: 'https://www.youtube.com/user/0TonyTien0',
      },
      {
        icon: 'mdi-discord',
        url: 'https://discord.com/invite/t4thSgHCu7',
      },
    ],
  }),
}
</script>
