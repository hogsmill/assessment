<template>
  <div>
    <h3>
      Like it or not, all teams are potentially dysfunctional.
      Fortunately the causes of dysfunction are both identifiable and curable.
    </h3>
    <h3>
      Answer the following questions for your team to determine where you are
      in terms of dysfunction.
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
