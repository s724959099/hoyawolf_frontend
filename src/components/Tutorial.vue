<template>
  <v-banner class="red white--text" single-line>
    <v-icon slot="icon" color="white" size="36"> mdi-tab-search </v-icon>
    遇到問題了嗎？「新手教學」可以幫助你找到答案

    <template v-slot:actions>
      <v-btn class="white red--text" color="red" text>
        <a
          class="red--text"
          :href="notion"
          target="_blank"
          rel="noopener noreferrer"
        >
          前往新手教學
        </a>
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
export default {
  data: () => ({
    notion:
      'https://www.notion.so/hazelwu/Opensea-029f2842fc7642ea8b6382906d1bf0bd',
  }),
}
</script>
