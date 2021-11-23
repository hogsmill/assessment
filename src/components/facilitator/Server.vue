<template>
  <table class="facilitator-table server-table">
    <tr>
      <td colspan="2">
        <h4>Server</h4>
        <i v-if="showServer" @click="setShowServer(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showServer" @click="setShowServer(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Reset (Delete) Questions
      </td>
      <td>
        <button class="btn btn-info btn-sm" @click="clearQuestions()">
          Clear
        </button>
      </td>
    </tr>
    <tr v-if="showServer && allowComments">
      <td>
        Allow Comments on Questions
      </td>
      <td>
        <input type="checkbox" :checked="server.comments" @click="toggleComments()">
        (Show whose comment?
        <input type="checkbox" :checked="server.commentsBy" @click="toggleCommentsBy()">)
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Allow show other team members answers
      </td>
      <td>
        <input type="checkbox" :checked="server.showTeamAnswers" @click="toggleShowTeamAnswers()">
        (Show whose answer?
        <input type="checkbox" :checked="server.showTeamAnswersBy" @click="toggleShowTeamAnswersBy()">)
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Go to next question on click?
      </td>
      <td>
        <input type="checkbox" :checked="server.autoNextQuestion" @click="toggleAutoNextQuestion()">
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Host moves slides?
      </td>
      <td>
        <input type="checkbox" :checked="server.hostMovesSlides" @click="toggleHostMovesSlides()">
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Scope
      </td>
      <td>
        <select id="server-scope-select" :value="server.scope" @change="setScope()">
          <option value="">
            -- Select --
          </option>
          <option value="individual">
            Individual (Results are emailled)
          </option>
          <option value="organisation">
            Organisation (Internal team assessments)
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showServer && server.scope == 'organisation'">
      <td>
        Teams in Departments?
      </td>
      <td>
        <input type="checkbox" :checked="server.teamsInDepartments" @click="toggleTeamsInDepartments()">
      </td>
    </tr>
    <tr v-if="showServer && server.scope == 'organisation'">
      <td>
        Multiple Teams?
      </td>
      <td>
        <input type="checkbox" :checked="server.multipleTeams" @click="toggleMultipleTeams()">
      </td>
    </tr>
    <tr v-if="showServer && server.scope == 'organisation'">
      <td>
        Frequency
      </td>
      <td>
        <select id="server-frequency-select" :value="server.frequency" @change="setFrequency()">
          <option value="oneoff">
            One-Off
          </option>
          <option value="monthly">
            Monthly
          </option>
          <option value="quarterly">
            Quarterly
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showServer">
      <td>
        Non-admin can see all results?
      </td>
      <td>
        <input type="checkbox" :checked="server.nonAdminResults" @click="toggleNonAdminResults()">
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showServer: false
    }
  },
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    allowComments() {
      return this.$store.getters.getAllowComments
    }
  },
  methods: {
    setShowServer(val) {
      this.showServer = val
    },
    clearQuestions() {
      bus.$emit('sendClearQuestions')
    },
    setScope() {
      const scope = document.getElementById('server-scope-select').value
      bus.$emit('sendUpdateServer', {field: 'scope', value: scope})
    },
    toggleComments() {
      const comments = !this.server.comments
      bus.$emit('sendUpdateServer', {field: 'comments', value: comments})
    },
    toggleCommentsBy() {
      const commentsBy = !this.server.commentsBy
      bus.$emit('sendUpdateServer', {field: 'commentsBy', value: commentsBy})
    },
    toggleShowTeamAnswers() {
      const showTeamAnswers = !this.server.showTeamAnswers
      bus.$emit('sendUpdateServer', {field: 'showTeamAnswers', value: showTeamAnswers})
    },
    toggleShowTeamAnswersBy() {
      const showTeamAnswersBy = !this.server.showTeamAnswersBy
      bus.$emit('sendUpdateServer', {field: 'showTeamAnswersBy', value: showTeamAnswersBy})
    },
    toggleAutoNextQuestion() {
      const auto = !this.server.autoNextQuestion
      bus.$emit('sendUpdateServer', {field: 'autoNextQuestion', value: auto})
    },
    toggleHostMovesSlides() {
      const hostMovesSlides = !this.server.hostMovesSlides
      bus.$emit('sendUpdateServer', {field: 'hostMovesSlides', value: hostMovesSlides})
    },
    toggleTeamsInDepartments() {
      const departments = !this.server.teamsInDepartments
      bus.$emit('sendUpdateServer', {field: 'teamsInDepartments', value: departments})
    },
    toggleMultipleTeams() {
      const multiple = !this.server.multipleTeams
      bus.$emit('sendUpdateServer', {field: 'multipleTeams', value: multiple})
    },
    toggleNonAdminResults() {
      const nonAdmin = !this.server.nonAdminResults
      bus.$emit('sendUpdateServer', {field: 'nonAdminResults', value: nonAdmin})
    },
    setFrequency() {
      const frequency = document.getElementById('server-frequency-select').value
      bus.$emit('sendUpdateServer', {field: 'frequency', value: frequency})
    }
  }
}
</script>

<style lang="scss">
  .teams-table {
    width: 100%;

    th {
      text-align: center;
      padding: 2px 6px;
    }

    td {
      &.center {
        text-align: center;
      }

      .actions {
        width: 100px;
        text-align: center;

        .fas {
          margin: 2px 2px;
        }
      }

      .team-name {
        width: 200px;
      }
    }
  }
</style>
