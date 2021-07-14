<template>
  <div>
    <h3>
      Results
      <i v-if="server.scope == 'individual'" class="far fa-envelope" title="Email results" @click="mailResults()" />
      <i v-if="server.scope == 'organisation'" class="fas fa-users selected" title="Team results" />
      <i v-if="server.scope == 'organisation'" class="fas fa-industry" title="Organisation results" />
    </h3>
    <Details v-if="server.scope == 'individual'" />
    <div v-for="(question, index) in questions" class="results" :key="index">
      <Result5Dysfunctions v-if="appType == '5 Dysfunctions'" :question="question" />
      <ResultTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
    </div>
  </div>
</template>

<script>
import mailFuns from '../../lib/mail.js'

import fiveDysfunctions from '../../lib/fiveDysfunctions.js'

import Details from './Details.vue'

import Result5Dysfunctions from './fiveDysfunctions/Result.vue'
import ResultTeamHealthCheck from './teamHealthCheck/Result.vue'

export default {
  components: {
    Details,
    Result5Dysfunctions,
    ResultTeamHealthCheck
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    questions() {
      return this.$store.getters.getQuestions
    },
    server() {
      return this.$store.getters.getServer
    },
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    mailResults() {
      const name = document.getElementById('details-name').value
      const organisation = document.getElementById('details-organisation').value
      const email = document.getElementById('details-email').value
      if (!email) {
        alert('Please enter a valid email address so we can send you your results')
      }
      let title, comments
      switch(this.appType) {
        case '5 Dysfunctions':
          title = fiveDysfunctions.emailTitle(name, organisation, this.assessment)
          comments = fiveDysfunctions.emailContent(name, organisation, this.assessment)
      }
      console.log(email, title, comments)
      mailFuns.post({
        action: title,
        email: encodeURIComponent(email),
        comments: encodeURIComponent(comments)
        },
        'Your results are on the way!'
      )
    }
  }
}
</script>

<style lang="scss">
  h3 {
    .fas, .far {
      margin-left: 4px;
      color: #888;

      &.selected {
        color: #444;
      }
    }
  }

  .results {
    max-width: 75%;
    margin: 0 auto;
  }
</style>
