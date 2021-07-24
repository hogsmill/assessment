<template>
  <div>
    <h3>
      Results
    </h3>
    <div class="controls">
      <i v-if="server.scope == 'individual'" class="far fa-envelope" title="Email results" @click="mailResults()" />
      <i v-if="server.scope == 'organisation' && server.multipleTeams" class="fas fa-users selected" title="Team results" />
      <i v-if="server.scope == 'organisation' && server.multipleTeams" class="fas fa-industry" title="Organisation results" />
    </div>
    <Details v-if="server.scope == 'individual'" />
    <div v-if="appType == '5 Dysfunctions'">
      <div v-for="(dysfunction, index) in Object.keys(results)" class="results" :key="index">
        <Result5Dysfunctions v-if="appType == '5 Dysfunctions'" :dysfunction="dysfunction" :value="results[dysfunction]" />
      </div>
      <div class="explanation" v-html="explanation()" />
    </div>
    <div v-if="appType == 'Team Health Check'">
      <div v-for="(question, index) in questions" class="results" :key="index">
        <ResultTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

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
    },
    results() {
      return this.$store.getters.getResults
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  created() {
    bus.$emit('sendGetResults', {assessment: this.assessment})

    bus.$on('loadResults', (data) => {
      console.log('results', data)
      this.$store.dispatch('updateResults', data)
    })
  },
  methods: {
    explanation() {
      return fiveDysfunctions.explanation().replace(/\n/g, '<br>')
    },
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
          comments = fiveDysfunctions.emailContent(name, organisation, this.results)
      }
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
  .controls {

    padding-bottom: 24px;

    .fas, .far {
      font-size: xx-large;
      margin-left: 4px;
      color: #bbb;

      &:hover {
        color: #444;
        cursor: pointer;
      }

      &.selected {
        color: #444;
      }
    }
  }

  .results {
    max-width: 90%;
    margin: 0 auto;
    font-size: larger;
  }

  .explanation {
    margin-top: 48px;
    padding: 12px;
    text-align: left;
    border: 4px solid red;
    border-radius: 12px;

    h3 {
      text-align: center;
    }
  }
</style>
