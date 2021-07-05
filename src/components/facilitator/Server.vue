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
      <td rowspan="2">
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
    setScope() {
      const scope = document.getElementById('server-scope-select').value
      bus.$emit('sendUpdateServerScope', {scope: scope})
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
