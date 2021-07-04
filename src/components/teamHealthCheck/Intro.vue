<template>
  <div>
    <h3>
      It's important to take the pulse of teams regularly... 
    </h3>
    <div>
      <button class="btn btn-info" @click="setState('questions')">
        Start
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  methods: {
    setState(state) {
      this.$store.dispatch('updateState', 'questions')
    }
  }
}
</script>
