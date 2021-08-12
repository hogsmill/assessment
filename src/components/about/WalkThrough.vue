<template>
  <div class="walk-through">
    <FiveDysfunctions v-if="appType == '5 Dysfunctions'" />
    <TeamHealthCheck v-if="appType == 'Team Health Check'" />
  </div>
</template>

<script>
import FiveDysfunctions from './walkthrough/FiveDysfunctions.vue'
import TeamHealthCheck from './walkthrough/TeamHealthCheck.vue'

export default {
  components: {
    FiveDysfunctions,
    TeamHealthCheck
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    }
  }
}
</script>
