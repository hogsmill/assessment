<template>
  <table class="facilitator-table teams-table">
    <tr>
      <td colspan="2">
        <h4>Teams</h4>
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
          <thead>
            <tr>
              <th>
                Actions
              </th>
              <th>
                Team
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in teams" :key="index">
              <td>
                <div class="actions">
                  <i v-if="team.protected" class="fas fa-trash-alt" title="Unable to delete system team" />
                  <i v-if="!team.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + team.name" @click="deleteTeam(team)" />
                  <i v-if="editingTeam != team.id" class="fas fa-edit" @click="setEditingTeam(team)" />
                  <i v-if="editingTeam == team.id" class="fas fa-save" @click="saveTeamName(team)" />
                </div>
              </td>
              <td>
                <div class="team-name">
                  <span v-if="editingTeam != team.id">{{ team.name }}</span>
                  <input v-if="editingTeam == team.id" type="text" :id="'team-name-editing-' + team.id" :value="team.name">
                </div>
              </td>
            </tr>
          </tbody>
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
      showTeam: false,
      editingTeam: null
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
    },
    setEditingTeam(team) {
      this.editingTeam = team.id
    },
    saveTeamName() {
      const name = document.getElementById('team-name-editing-' + this.editingTeam).value
      bus.$emit('sendUpdateTeamName', {id: this.editingTeam, name: name})
      this.editingTeam = null
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
