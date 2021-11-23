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
              <th rowspan="2">
                Actions
              </th>
              <th rowspan="2">
                Member
              </th>
              <th rowspan="2">
                Email
              </th>
              <th colspan="12">
                Assessments (click to delete)
              </th>
            </tr>
            <tr>
              <td v-for="(date, dindex) in assessmentsDone.labels" :key="dindex">
                {{ date }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in members" :key="index">
              <td>
                <div class="actions">
                  <i class="fas fa-trash-alt enabled" :title="'Delete ' + member.name" @click="deleteMember(member)" />
                  <i v-if="editingMember != member.id" class="fas fa-edit" @click="setEditingMember(member)" />
                  <i v-if="editingMember == member.id" class="fas fa-save" @click="saveMemberDetails()" />
                  <i class="fas fa-users" @click="showChangeTeam(member)" />
                  <div v-if="changingTeamMember == member.id">
                    <select :id="'change-team-' + member.id" @change="changeTeam(member)">
                      <option value="">
                        -- Select --
                      </option>
                      <option v-for="(t, tindex) in teams" :key="tindex" :value="t.id">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </td>
              <td>
                <div class="member-name">
                  <span v-if="editingMember != member.id">{{ member.name }}</span>
                  <input v-if="editingMember == member.id" type="text" :id="'member-name-editing-' + member.id" :value="member.name">
                </div>
              </td>
              <td>
                <div class="member-email">
                  <span v-if="editingMember != member.id">{{ member.email }}</span>
                  <input v-if="editingMember == member.id" type="text" :id="'member-email-editing-' + member.id" :value="member.email">
                </div>
              </td>
              <td v-for="(done, dindex) in assessmentsDone.labels" :key="dindex" class="center">
                <i v-if="assessmentDone(member.id, done)" class="fas fa-check assessment-done" title="Delete this assessment" @click="deleteAssessment(member, done)" />
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
      editingMember: null,
      changingTeamMember: null,
      assessmentsDone: {
        labels: [],
        done: {}
      }
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

    bus.$on('loadAssessmentsDone', (data) => {
      this.assessmentsDone = data
    })
    this.setNoTeam()
  },
  methods: {
    assessmentDone(id, label) {
      let done = false
      const member = this.assessmentsDone.done[id]
      if (member) {
        done = member.find((m) => {
          return m == label
        })
      }
      return done
    },
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
      }
      const team = this.teams.find((t) => {
        return t.id == this.selectedTeam
      })
      this.members = team ? team.members : []
      if (team) {
        bus.$emit('sendAssessmentsDone', {id: team.id})
      }
    },
    showChangeTeam(member) {
      this.changingTeamMember = member.id
    },
    changeTeam(member) {
      const teamId = document.getElementById('change-team-' + member.id).value
      bus.$emit('sendChangeTeam', {teamId: teamId, member: member})
      this.changingTeamMember = null
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
    saveMemberDetails() {
      const name = document.getElementById('member-name-editing-' + this.editingMember).value
      const email = document.getElementById('member-email-editing-' + this.editingMember).value
      bus.$emit('sendUpdateMemberDetails', {teamId: this.selectedTeam, id: this.editingMember, name: name, email: email})
      this.editingMember = null
    },
    deleteAssessment(member, label) {
      if (confirm('Delete assessment from ' + label + ' for ' + member.name)) {
        bus.$emit('sendDeleteAssessment', {teamId: this.selectedTeam, memberId: member.id, label: label})
      }
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
          cursor: pointer;
        }
      }

      .member-name {
        width: 200px;
      }

      .assessment-done:hover {
        cursor: pointer;
      }
    }
  }
</style>
