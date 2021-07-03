<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Team</h4>
        <i v-if="showTeam" @click="setShowTeam(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeam" @click="setShowTeam(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showTeam">
      <td>
        <input type="text" id="new-team">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addTeam()">
          Add New
        </button>
      </td>
    </tr>
    <tr v-if="showTeam">
      <td>
        <table>
          <tr v-for="(team, index) in teams" :key="index">
            <td>
              <i v-if="team.protected" class="fas fa-trash-alt" title="Unable to delete system team" />
              <i v-if="!team.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + team.name" @click="deleteTeam(team)" />
            </td>
            <td>
              {{ team.name }}
            </td>
          </tr>
        </table>
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
    teams() {
      return this.$store.getters.getTeams
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showTeam') {
        this.showTeam = false
      }
    })
  },
  methods: {
    setShowTeam(val) {
      this.showTeam = val
      if (val) {
        bus.$emit('openEditPane', 'showTeam')
      }
    },
    addTeam() {
      const name = document.getElementById('new-team').value
      bus.$emit('sendAddTeam', {name: name})
    },
    deleteTeam(team) {
      if (confirm('Delete ' + team.name)) {
        bus.$emit('sendDeleteTeam', {id: team.id})
      }
    }
  }
}
</script>
