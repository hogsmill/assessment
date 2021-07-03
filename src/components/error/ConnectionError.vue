<template>
  <div>
    <div v-if="connectionError" class="connection-error">
      WARNING: You are not connected to the server: {{ connectionError }}
    </div>
    <div v-if="localStorageStatus != 'ok'" class="connection-error">
      WARNING: {{ localStorageStatus }}<br>please enable cookies in browser settings
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    connectionError() {
      return this.$store.getters.getConnectionError
    },
    localStorageStatus() {
      return this.$store.getters.getLocalStorageStatus
    }
  }
}
</script>

<style lang="scss">
  .connection-error {
    background-color: red;
    color: #fff;
    font-weight: bold;
    margin: 6px;
  }
</style>
