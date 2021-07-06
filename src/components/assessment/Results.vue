<template>
  <div>
    <h3>
      Results (Put email icon here)
    </h3>
    <div v-for="(question, index) in questions" class="results" :key="index">
      <Result5Dysfunctions v-if="appType == '5 Dysfunctions'" :question="question" />
      <ResultTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
    </div>
  </div>
</template>

<script>

import Result5Dysfunctions from './fiveDysfunctions/Result.vue'
import ResultTeamHealthCheck from './teamHealthCheck/Result.vue'

export default {
  components: {
    Result5Dysfunctions,
    ResultTeamHealthCheck
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    questions() {
      return this.$store.getters.getQuestions
    }
  }
}
</script>

<style lang="scss">
  .results {
    max-width: 75%;
    margin: 0 auto;
  }
</style>
