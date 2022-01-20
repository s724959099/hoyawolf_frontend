<template>
  <div id="alert">
    <v-dialog persistent v-model="show" max-width="500">
      <v-card
        class="card d-flex align-center justify-center flex-column popupbg"
      >
        <icon
          v-if="iconUrl"
          :data="iconUrl"
          width="36px"
          height="36px"
          :class="color"
        />

        <span class="mt-2 px-2 subtitle-2 text-center textw--text">
          {{ text }}
        </span>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="cyan white--text" text @click="closeAlert"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// Utils
import { mapActions } from 'vuex'
// Components
/* eslint-disable vue/return-in-computed-property */
import error from '@/assets/icons/alert/error.svg'
import success from '@/assets/icons/alert/done.svg'
import warning from '@/assets/icons/alert/fail.svg'

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    icon: {
      type: String,
      default: 'done',
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'info',
    },
  },

  data: () => ({
    error,
    success,
    warning,
  }),

  computed: {
    color() {
      switch (this.type) {
        case 'error':
          return 'red--text'

        case 'success':
        case 'warn':
          return 'primary--text'

        case 'warning':
          return 'warning--text'

        case 'info':
          return 'info--text'

        default:
          return 'info--text'
      }
    },

    iconUrl() {
      return this[this.type]
    },
  },

  methods: {
    ...mapActions(['closeAlert']),
  },
}
</script>

<style lang="scss" scoped>
#alert {
  position: fixed;
  top: 5%;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
}
.v-sheet.v-alert {
  margin: 0 auto;
  margin-top: 3rem;
}

.card {
  padding: 1.2rem;
}
</style>
