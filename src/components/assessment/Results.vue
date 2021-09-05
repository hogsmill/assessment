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
                This
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
            <div :class="{ 'selected': scope.format == 'graph' }">
              <i class="fas fa-chart-line" @click="setScope('format', 'graph')" />
              <br>
              <span>
                Graph
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <Details v-if="server.scope == 'individual'" />
    <ResultsHeader v-if="scope.format == 'table' && server.frequency != 'oneoff'" :results="tabularResults" />

    <!-- 5 Dysfunctions -->

    <div v-if="appType == '5 Dysfunctions'" :class="{'visible': scope.format == 'table'}" class="result-block">
      <div v-for="(result, index) in Object.keys(tabularResults)" class="results" :key="index">
        <Result5Dysfunctions :result="tabularResults[result]" :scope="scope" />
      </div>
    </div>
    <div v-if="appType == '5 Dysfunctions'" :class="{'visible': scope.format == 'graph'}" class="result-block">
      <LineChart />
    </div>
    <div v-if="appType == '5 Dysfunctions'" class="explanation-holder">
      <div class="explanation" v-html="explanation()" />
    </div>

    <!-- Team Health Check -->

    <div v-if="appType == 'Team Health Check'" :class="{'visible': scope.format == 'table'}" class="result-block">
      <div v-for="(result, index) in Object.keys(tabularResults)" class="results" :key="index">
        <ResultTeamHealthCheck :result="tabularResults[result]" :scope="scope" />
      </div>
    </div>
    <div v-if="appType == 'Team Health Check'" :class="{'visible': scope.format == 'graph'}" class="result-block">
      <LineChart />
    </div>

    <!-- Agile Maturity -->

    <div v-if="appType == 'Agile Maturity'" :class="{'visible': scope.format == 'table'}" class="result-block">
      <div v-for="(result, index) in Object.keys(tabularResults)" class="results" :key="index">
        <ResultAgileMaturity :result="tabularResults[result]" :scope="scope" />
      </div>
    </div>
    <div v-if="appType == 'Agile Maturity'" :class="{'visible': scope.format == 'graph'}" class="result-block">
      <LineChart />
    </div>

    <modal name="question-comments" id="question-comments" :height="500" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <h3>
        Comments for <br>
        {{ commentsTitle }}
      </h3>
      <div class="mt-4">
        <ul>
          <li v-for="(comment, index) in comments" :key="index">
            {{ comment.comment }}
            <span v-if="server.commentsBy">
              ({{ comment.by }})
            </span>
          </li>
        </ul>
      </div>
    </modal>
  </div>
</template>

<script>
import bus from '../../socket.js'

import mailFuns from '../../lib/mail.js'

import fiveDysfunctions from '../../lib/email/fiveDysfunctions.js'
import teamHealthCheck from '../../lib/email/teamHealthCheck.js'
import agileMaturity from '../../lib/email/agileMaturity.js'

import Details from './Details.vue'

import ResultsHeader from './ResultsHeader.vue'
import Result5Dysfunctions from './fiveDysfunctions/Result.vue'
import ResultTeamHealthCheck from './teamHealthCheck/Result.vue'
import ResultAgileMaturity from './agileMaturity/Result.vue'

import LineChart from './graphs/lineChart/Graph.vue'
import lineChartFuns from './graphs/lineChart/data.js'

export default {
  components: {
    Details,
    ResultsHeader,
    Result5Dysfunctions,
    ResultTeamHealthCheck,
    ResultAgileMaturity,
    LineChart
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
      },
      comments: [],
      commentsTitle: '',
      graphOptions: lineChartFuns.options()
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
    tabularResults() {
      return this.$store.getters.getTabularResults
    },
    graphResults() {
      return this.$store.getters.getGraphResults
    }
  },
  created() {
    if (this.server.scope == 'individual') {
      this.getIndividualResults()
    }

    bus.$on('loadTabularResults', (data) => {
      console.log('loadTabularResults', data)
      this.$store.dispatch('updateTabularResults', data)
    })

    bus.$on('loadGraphResults', (data) => {
      if (data.datasets) {
        this.$store.dispatch('updateGraphResults', data.datasets)
        this.setGraph(data)
      }
    })

    bus.$on('showQuestionComments', (data) => {
      this.showComments(data)
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
    showComments(data) {
      this.comments = data.comments
      this.commentsTitle = data.title
      this.$modal.show('question-comments')
    },
    hide() {
      this.comments = []
      this.commentsTitle = ''
      this.$modal.hide('question-comments')
    },
    setGraph(results) {
      const data = lineChartFuns.data(results)
      bus.$emit('showGraph', {chartdata: data, options: this.graphOptions})
    },
    explanation() {
      return fiveDysfunctions.explanation()
    },
    mailResults() {
      const name = document.getElementById('details-name').value
      const organisation = document.getElementById('details-organisation').value
      const email = document.getElementById('details-email').value
      if (!email) {
        alert('Please enter a valid email address so we can send you your results')
      } else {
        let title, message
        switch(this.appType) {
          case '5 Dysfunctions':
            title = fiveDysfunctions.emailTitle(name, organisation, this.assessment)
            message = fiveDysfunctions.emailContent(name, organisation, this.results)
            break
          case 'Team Health Check':
            title = teamHealthCheck.emailTitle(name, organisation, this.assessment)
            message = teamHealthCheck.emailContent(name, organisation, this.results)
            break
          case 'Agile Maturity':
            title = agileMaturity.emailTitle(name, organisation, this.assessment)
            message = agileMaturity.emailContent(name, organisation, this.results)
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

  canvas {
    max-width: 90%;
    margin: 0 auto;
  }

  .controls {

    &.individual {
      font-size: larger;

      .far {
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

  .result-block {
    visibility: hidden;
    height: 0;

    &.visible {
      visbility: visible;
      height: auto;
    }
  }

  .results {
    max-width: 90%;
    margin: 0 auto;
    font-size: larger;
  }

  .explanation-holder {
    margin: 48px auto 12px auto;
    max-width: 750px;

    .explanation {
      padding: 12px;
      text-align: left;
      border: 4px solid red;
      border-radius: 12px;
      margin: 0 24px;

      h3 {
        text-align: center;
      }
    }
  }

  #question-comments {
    li {
      text-align: left;
    }
  }
</style>
