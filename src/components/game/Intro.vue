<template>
  <div>
    Intro {{ appType }}
  </div>
</template>

<script>
export default {
  computed: {
    appType() {
      return this.$store.getters.appType
    }
  }
}
</script>
