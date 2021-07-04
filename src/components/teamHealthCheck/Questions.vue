<template>
  <div>Questions</div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    }
  }
}
</script>
