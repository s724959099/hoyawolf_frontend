<template>
  <div id="alert">
    <v-alert
      prominent
      dense
      :type="type"
      :value="show"
      max-width="500"
      transition="scale-transition"
    >
      {{ text }}
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
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
</style>
