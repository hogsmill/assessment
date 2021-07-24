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
    <tr v-if="showServer">
      <td>
        Got to next question in click?
      </td>
      <td>
        <input type="checkbox" :checked="server.autoNextQuestion" @click="setAutoNextQuestion()">
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
          <option value="">
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
    setAutoNextQuestion() {
      const auto = !this.server.autoNextQuestion
      bus.$emit('sendUpdateServer', {field: 'autoNextQuestion', value: auto})
    },
    toggleMultipleTeams() {
      const multiple = !this.server.multipleTeams
      bus.$emit('sendUpdateServer', {field: 'multipleTeams', value: multiple})
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
