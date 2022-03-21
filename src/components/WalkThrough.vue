<template>
  <span>
    <button class="btn btn-sm btn-info mb-2" @click="help()">
      Explain this for me...
    </button>
  </span>
</template>

<script>
export default {
  methods: {
    help() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>
