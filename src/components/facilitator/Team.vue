<template>
  <table class="facilitator-table team-table">
    <tr>
      <td colspan="2">
        <h4>Team</h4>
        <i v-if="showTeam" @click="setShowTeam(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeam" @click="setShowTeam(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showTeam">
      <td>
        Team Name
      </td>
      <td>
        <input type="text" id="team-name">
        <button class="btn btn-sm btn-secondary smaller-font" @click="saveTeam()">
          Save
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showTeam: false
    }
  },
  computed: {
    team() {
      return this.$store.getters.getTeam
    }
  },
  methods: {
    setShowTeam(val) {
      this.showTeam = val
    },
    saveTeam() {
      const name = document.getElementById('team-name').value
      bus.emit('sendUpdateTeam', {name: name})
    }
  }
}
</script>

<style lang="scss">
  .team-table {
    width: 100%;

    th {
      text-align: center;
      padding: 2px 6px;
    }

    td {
      &.center {
        text-align: center;
      }

      .team-name {
        width: 200px;
      }
    }
  }
</style>
