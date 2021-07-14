<template>
  <table class="facilitator-table members-table">
    <tr>
      <td colspan="2">
        <h4>Members</h4>
        <i v-if="showMembers" @click="setShowMember(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showMembers" @click="setShowMember(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showMembers && server.multipleTeams">
      <td>
        Team: <select id="team-select" @change="setTeam()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(t, index) in teams" :key="index" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showMembers">
      <td>
        <input type="text" id="new-member">
        <button class="btn btn-sm btn-secondary smaller-font" :disabled="server.multipleTeams && !selectedTeam" @click="addMember()">
          Add New
        </button>
      </td>
    </tr>
    <tr v-if="showMembers">
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Actions
              </th>
              <th>
                Member
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in members" :key="index">
              <td>
                <div class="actions">
                  <i class="fas fa-trash-alt enabled" :title="'Delete ' + member.name" @click="deleteMember(member)" />
                  <i v-if="editingMember != member.id" class="fas fa-edit" @click="setEditingMember(member)" />
                  <i v-if="editingMember == member.id" class="fas fa-save" @click="saveMemberName()" />
                </div>
              </td>
              <td>
                <div class="member-name">
                  <span v-if="editingMember != member.id">{{ member.name }}</span>
                  <input v-if="editingMember == member.id" type="text" :id="'member-name-editing-' + member.id" :value="member.name">
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
      showMembers: false,
      members: [],
      selectedTeam: null,
      editingMember: null
    }
  },
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    noTeam() {
      return this.$store.getters.getNoTeam
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  created() {
    bus.$on('loadTeams', (data) => {
      if (this.selectedTeam) {
        this.setTeam(this.selectedTeam)
      }
    })

    bus.$on('loadServer', (data) => {
      this.setNoTeam()
    })

    this.setNoTeam()
  },
  methods: {
    setShowMember(val) {
      this.showMembers = val
    },
    setNoTeam() {
      if (!this.server.multipleTeams) {
        this.selectedTeam = this.noTeam.id
        this.members = this.noTeam.members
      } else {
        this.selectedTeam = null
        this.members = []
      }
    },
    setTeam(teamId) {
      if (teamId) {
        this.selectedTeam = teamId
      } else {
        this.selectedTeam = document.getElementById('team-select').value
        const team = this.teams.find((t) => {
          return t.id == this.selectedTeam
        })
        this.members = team ? team.members : []
      }
    },
    addMember() {
      const name = document.getElementById('new-member').value
      bus.$emit('sendAddMember', {teamId: this.selectedTeam, name: name})
    },
    deleteMember(member) {
      if (confirm('Delete ' + member.name)) {
        bus.$emit('sendDeleteMember', {teamId: this.selectedTeam, id: member.id})
      }
    },
    setEditingMember(member) {
      this.editingMember = member.id
    },
    saveMemberName() {
      const name = document.getElementById('member-name-editing-' + this.editingMember).value
      bus.$emit('sendUpdateMemberName', {teamId: this.selectedTeam, id: this.editingMember, name: name})
      this.editingMember = null
    }
  }
}
</script>

<style lang="scss">
  .members-table {
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

      .member-name {
        width: 200px;
      }
    }
  }
</style>
