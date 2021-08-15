<template>
  <div>
    <h3>
      Results
    </h3>
    <div v-if="server.scope == 'individual'" class="controls individual">
      Click <i class="far fa-envelope" title="Email results" @click="mailResults()" /> to send results
    </div>
    <div v-if="summary && server.scope == 'organisation'" class="controls">
      <table>
        <tr>
          <td class="show first">
            Results
          </td>
          <td>
            <div :class="{ 'selected': scope.member == 'individual' }">
              <i class="fas fa-user" title="My results" @click="setScope('member', 'individual')" />
              <br>
              <span>
                Me
              </span>
            </div>
          </td>
          <td>
            <div :class="{ 'selected': scope.member == 'team' }">
              <i v-if="server.multipleTeams" class="fas fa-users" title="Team results" @click="setScope('member', 'team')" />
              <br>
              <span>
                My Team
              </span>
            </div>
          </td>
          <td>
            <div :class="{ 'selected': scope.member == 'organisation' }">
              <i v-if="server.multipleTeams" class="fas fa-industry" title="Organisation results" @click="setScope('member', 'organisation')" />
              <br>
              <span>
                Org
              </span>
            </div>
          </td>
          <td class="show" v-if="server.frequency != 'oneoff'">
            Dates
          </td>
          <td v-if="server.frequency != 'oneoff'">
            <div :class="{ 'selected': scope.date == 'single' }">
              <i class="fas fa-calendar-day" @click="setScope('date', 'single')" />
              <br>
              <span>
                Latest
              </span>
            </div>
          </td>
          <td v-if="server.frequency != 'oneoff'">
            <div :class="{ 'selected': scope.date == 'all' }">
              <i class="fas fa-calendar-alt" @click="setScope('date', 'all')" />
              <br>
              <span>
                All
              </span>
            </div>
          </td>
          <td class="show">
            Format
          </td>
          <td>
            <div :class="{ 'selected': scope.format == 'table' }">
              <i class="fas fa-file-alt" @click="setScope('format', 'table')" />
              <br>
              <span>
                Table
              </span>
            </div>
          </td>
          <td>
            <div :class="{ 'selected': scope.format == 'graph-separate' }">
              <i class="fas fa-chart-line" @click="setScope('format', 'graph-separate')" />
              <br>
              <span>
                Compare
              </span>
            </div>
          </td>
          <td>
            <div :class="{ 'selected': scope.format == 'graph-aggregate' }">
              <i class="fas fa-chart-area" @click="setScope('format', 'graph-aggregate')" />
              <br>
              <span>
                Aggregate
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <Details v-if="server.scope == 'individual'" />
    <ResultsHeader :results="results" v-if="server.frequency != 'oneoff'" />
    <div v-if="appType == '5 Dysfunctions'">
      <div v-for="(result, index) in Object.keys(results)" class="results" :key="index">
        <Result5Dysfunctions v-if="appType == '5 Dysfunctions'" :result="results[result]" :scope="scope" />
      </div>
      <div class="explanation" v-html="explanation()" />
    </div>
    <div v-if="appType == 'Team Health Check'">
      <div v-for="(result, index) in Object.keys(results)" class="results" :key="index">
        <ResultTeamHealthCheck v-if="appType == 'Team Health Check'" :result="results[result]" :scope="scope" />
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import mailFuns from '../../lib/mail.js'

import fiveDysfunctions from '../../lib/email/fiveDysfunctions.js'
import teamHealthCheck from '../../lib/email/teamHealthCheck.js'

import Details from './Details.vue'

import ResultsHeader from './ResultsHeader.vue'
import Result5Dysfunctions from './fiveDysfunctions/Result.vue'
import ResultTeamHealthCheck from './teamHealthCheck/Result.vue'

export default {
  components: {
    Details,
    ResultsHeader,
    Result5Dysfunctions,
    ResultTeamHealthCheck
  },
  props: [
    'summary'
  ],
  data() {
    return {
      scope: {
        member: 'individual',
        date: 'single',
        format: 'table'
      }
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    server() {
      return this.$store.getters.getServer
    },
    assessment() {
      return this.$store.getters.getAssessment
    },
    results() {
      return this.$store.getters.getResults
    }
  },
  created() {
    if (this.server.scope == 'individual') {
      this.getIndividualResults()
    }

    bus.$on('loadResults', (data) => {
      console.log('results', data)
      this.$store.dispatch('updateResults', data)
    })
  },
  methods: {
    getIndividualResults() {
      bus.$emit('sendGetResults', {appType: this.appType, scope: null, assessment: this.assessment})
    },
    getResults() {
      bus.$emit('sendGetResults', {appType: this.appType, scope: this.scope, assessment: this.assessment})
    },
    setScope(scope, value) {
      this.scope[scope] = value
      bus.$emit('sendGetResults', {appType: this.appType, scope: this.scope, assessment: this.assessment})
    },
    explanation() {
      return fiveDysfunctions.explanation().replace(/\n/g, '<br>')
    },
    mailResults() {
      const name = document.getElementById('details-name').value
      const organisation = document.getElementById('details-organisation').value
      const email = document.getElementById('details-email').value
      if (!email) {
        alert('Please enter a valid email address so we can send you your results')
      } else {
        let title, message
        console.log(this.appType)
        switch(this.appType) {
          case '5 Dysfunctions':
            title = fiveDysfunctions.emailTitle(name, organisation, this.assessment)
            message = fiveDysfunctions.emailContent(name, organisation, this.results)
            break
          case 'Team Health Check':
            title = teamHealthCheck.emailTitle(name, organisation, this.assessment)
            message = teamHealthCheck.emailContent(name, organisation, this.results)
            break
        }
        bus.$emit('sendResultsMailled', {assessment: this.assessment, results: this.results})
        mailFuns.send({
          email: email,
          subject: title,
          message: encodeURIComponent(message)
          },
          'Your results are on the way!'
        )
      }
    }
  }
}
</script>

<style lang="scss">
  .controls {

    &.individual {
      font-size: larger;

      .fas {
        position: relative;
        top: 5px;
      }
    }

    table {
      margin: 0 auto;

      td {
        padding: 6px;

        &.show {
          font-size: larger;
          font-weight: 600;
          padding-left: 24px;

          &.first {
            padding-left: 0;
          }
        }

        div {
          padding: 6px;
          width: 68px;

          span {
            font-size: smaller;
            font-style: italic;
          }

          &.selected {
            background-color: #888;
            color: #fff;
            border-radius: 6px;

            .fas, .far {
              color: #fff;
            }
          }
        }
      }
    }

    padding-bottom: 24px;

    .fas, .far {
      font-size: xx-large;
      margin-left: 4px;
      color: #bbb;

      &:hover {
        color: #444;
        cursor: pointer;
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
    margin: 12px 24px;

    h3 {
      text-align: center;
    }
  }
</style>
