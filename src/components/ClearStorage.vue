<template>
  <i class="fas fa-store-alt-slash clear-storage" @click="clearLocalStorage()" />
</template>

<script>
import ls from '../lib/localStorage.js'

export default {
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    }
  },
  methods: {
    clearLocalStorage() {
      if (confirm('Clear all your details from this game?')) {
        ls.clear(this.lsSuffix)
        location.reload()
      }
    }
  }
}
</script>

<style lang="scss">
  .clear-storage {
    float: right;
    margin-right: 6px;
    color: #888;

    &:hover {
      color: #444;
      cursor: pointer;
    }
  }
</style>
