<template>
  <table class="facilitator-table members-table">
    <tr>
      <td colspan="2">
        <h4>Members</h4>
        <i v-if="showMembers" @click="setShowMember(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showMembers" @click="setShowMember(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showMembers && server.teamsInDepartments">
      <td colspan="2" class="right">
        Export Completed Assessments <i class="fas fa-file-export" aria-hidden="true" title="Export completed assessments" @click="loadAllAssessmentsDone()" />
      </td>
    </tr>
    <tr v-if="showMembers && server.teamsInDepartments">
      <td colspan="2">
        <i>Select member to be in either a department (e.g. for head of department) or a team in a department</i>
      </td>
    </tr>
    <tr v-if="showMembers && server.teamsInDepartments">
      <td>
        Department: <select id="department-select" @change="setTeam('department')" :value="selectedDepartment">
          <option value="">
            -- Select --
          </option>
          <option v-for="(d, index) in departments" :key="index" :value="d.id">
            {{ d.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showMembers && server.multipleTeams">
      <td>
        Team: <select id="team-select" @change="setTeam('team')" :value="selectedTeam">
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
        <button class="btn btn-sm btn-secondary smaller-font" :disabled="server.multipleTeams && !selectedTeam && !selectedDepartment" @click="addMember()">
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
                Members <span v-if="members.length">({{ members.length }})</span>
              </th>
              <th rowspan="2" title="Team lead, head of etc.">
                Contact?
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
                    Dept.: <select :id="'change-department-' + member.id" @change="changeTeam('department', member)">
                      <option value="">
                        -- Select --
                      </option>
                      <option v-for="(d, dindex) in departments" :key="dindex" :value="d.id">
                        {{ d.name }}
                      </option>
                    </select>
                    Team: <select :id="'change-team-' + member.id" @change="changeTeam('team', member)">
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
                <input type="checkbox" :checked="member.mainContact" @click="makeMainContact(member)">
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
      selectedDepartment: null,
      selectedTeam: null,
      editingMember: null,
      changingTeamMember: null,
      allAssessmentsDone: null,
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
    },
    departments() {
      return this.$store.getters.getDepartments
    }
  },
  created() {
    bus.$on('loadTeams', (data) => {
      if (this.selectedTeam) {
        this.setTeam('team', this.selectedTeam)
      }
    })

    bus.$on('loadServer', (data) => {
      this.setNoTeam()
    })

    bus.$on('loadAssessmentsDone', (data) => {
      this.assessmentsDone = data
    })

    bus.$on('loadAllAssessmentsDone', (data) => {
      this.allAssessmentsDone = data
      this.exportAssessments()
    })

    this.setNoTeam()
  },
  methods: {
    loadAllAssessmentsDone() {
      bus.$emit('sendLoadAllAssessmentsDone')
    },
    exportAssessments() {
      const done = {}
      for (let t = 0; t < this.teams.length; t++) {
        const team = this.teams[t].name
        done[team] = {}
        for (let l = 0; l < this.allAssessmentsDone.labels.length; l++) {
          const label = this.allAssessmentsDone.labels[l]
          done[team][label] = {}
          for (let m = 0; m < this.teams[t].members.length; m++) {
            const mem = this.teams[t].members[m]
            const member = this.allAssessmentsDone.done[mem.id]
            done[team][label][mem.name] = {
              done: !!(member && member.indexOf(label) > -1)
            }
          }
        }
      }
      const results = []
      results.push('Team,Member,' + this.allAssessmentsDone.labels.join(','))
      const teams = Object.keys(done)
      for (let t = 0; t < teams.length; t++) {
        const team = done[teams[t]]
        const members = Object.keys(team[this.allAssessmentsDone.labels[0]])
        const labels = Object.keys(team)
        for (let m = 0; m < members.length; m++) {
          const allDone = []
          for (let l = 0; l < labels.length; l++) {
            allDone.push(done[teams[t]][labels[l]][members[m]].done ? 'y' : '')
          }
          results.push(teams[t] + ',' + members[m] + ',' + allDone.join(','))
        }
      }
      console.log(results.join('\n'))
    },
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
    setTeam(type, teamId) {
      let members = []
      if (teamId) {
        this.selectedTeam = teamId
        this.selectedDepartment = null
        const team = this.teams.find((t) => {
          return t.id == this.selectedTeam
        })
        members = team ? team.members : []
      } else {
        if (type == 'department') {
          this.selectedDepartment = document.getElementById('department-select').value
          this.selectedTeam = null
          const department = this.departments.find((d) => {
            return d.id == this.selectedDepartment
          })
          members = department && department.members ? department.members : []
          if (department) {
            bus.$emit('sendAssessmentsDone', {departmentId: department.id})
          }
        } else {
          this.selectedDepartment = null
          this.selectedTeam =  document.getElementById('team-select').value
          const team = this.teams.find((t) => {
            return t.id == this.selectedTeam
          })
          members = team ? team.members : []
          if (team) {
            bus.$emit('sendAssessmentsDone', {teamId: team.id})
          }
        }
      }
      this.members = this.memberSort(members)
    },
    memberSort(members) {
      const mems = members.sort((a, b) => {
        //return a.name < b.name
        return a.name.localeCompare(b.name)
      })
      const ms = []
      for (let i = 0; i < mems.length; i++) {
        if (mems[i].mainContact) {
          ms.push(mems[i])
        }
      }
      for (let j = 0; j < mems.length; j++) {
        if (!mems[j].mainContact) {
          ms.push(mems[j])
        }
      }
      return ms
    },
    showChangeTeam(member) {
      this.changingTeamMember = member.id
    },
    changeTeam(type, member) {
      const departmentId = document.getElementById('change-department-' + member.id).value
      const teamId = document.getElementById('change-team-' + member.id).value
      bus.$emit('sendChangeTeam', {teamId: teamId, member: member})
      this.changingTeamMember = null
    },
    addMember() {
      const name = document.getElementById('new-member').value
      bus.$emit('sendAddMember', {departmentId: this.selectedDepartment, teamId: this.selectedTeam, name: name})
      document.getElementById('new-member').value = ''
    },
    deleteMember(member) {
      if (confirm('Delete ' + member.name)) {
        bus.$emit('sendDeleteMember', {departmentId: this.selectedDepartment, teamId: this.selectedTeam, id: member.id})
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
    makeMainContact(member) {
      bus.$emit('sendMakeMainContact', {teamId: this.selectedTeam, id: member.id})
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

      &.right {
        text-align: right;
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
