<template>
  <div>
    <h3>
      It's important to take the pulse of teams regularly...
    </h3>
    <Details v-if="server.scope == 'individual'" />
    <div>
      <button class="btn btn-info" @click="setState('questions')">
        Start
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import Details from '../../components/Details.vue'

export default {
  components: {
    Details
  },
  computed: {
    server() {
      return this.$store.getters.getServer
    }
  },
  methods: {
    setState(state) {
      this.$store.dispatch('updateState', 'questions')
    }
  }
}
</script>
