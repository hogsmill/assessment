<template>
  <div class="setup">
    <table>
      <tr v-if="server.useOrganisationModel">
        <td>
          Name
        </td>
        <td>
          <NameSearch />
        </td>
      </tr>
      <tr v-if="server.teamsInDepartments && !server.useOrganisationModel">
        <td>
          Department
        </td>
        <td>
          <select id="setup-select-department" @change="selectDepartment()">
            <option value="">
              -- Select --
            </option>
            <option v-for="(d, dindex) in departments" :key="dindex" :selected="assessment.department && d.id == assessment.department.id" :value="d.id">
              {{ d.name }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="server.multipleTeams && !server.useOrganisationModel">
        <td>
          Team
        </td>
        <td>
          <select id="setup-select-team" @change="selectTeam()">
            <option value="">
              -- Select --
            </option>
            <option v-for="(t, tindex) in teams" :key="tindex" :selected="assessment.team && t.id == assessment.team.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="!server.useOrganisationModel">
        <td>
          Team Member
        </td>
        <td>
          <select id="setup-select-myname" @change="selectMember()">
            <option value="">
              -- Select --
            </option>
            <option v-for="(m, mindex) in getMembers()" :key="mindex" :selected="assessment.member && m.id == assessment.member.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="server.frequency">
        <td v-if="server.frequency == 'monthly'">
          Month:
        </td>
        <td v-if="server.frequency == 'monthly'">
          <select id="setup-select-month" @change="selectMonth()">
            <option value="">
              -- Select --
            </option>
            <option v-for="m in 12" :key="m" :selected="assessment.month && m == assessment.month" :value="m">
              {{ m }}
            </option>
          </select>
        </td>
        <td v-if="server.frequency == 'quarterly'">
          Quarter:
        </td>
        <td v-if="server.frequency == 'quarterly'">
          <select id="setup-select-quarter" @change="selectQuarter()">
            <option value="">
              -- Select --
            </option>
            <option v-for="q in 4" :key="q" :selected="assessment.quarter && q == assessment.quarter" :value="q">
              Q{{ q }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="server.frequency">
        <td v-if="server.frequency != 'oneoff'" class="year">
          Year:
        </td>
        <td v-if="server.frequency != 'oneoff'">
          <select id="setup-select-year" @change="selectYear()">
            <option value="">
              -- Select --
            </option>
            <option v-for="y in 10" :key="y" :selected="assessment.year && y == assessment.year">
              {{ y + 2020 }}
            </option>
          </select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import ls from '../../lib/localStorage'

import NameSearch from './NameSearch.vue'

export default {
  components: {
    NameSearch
  },
  data() {
    return {
      lsData: {},
      members: []
    }
  },
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    server() {
      return this.$store.getters.getServer
    },
    departments() {
      return this.$store.getters.getDepartments
    },
    teams() {
      return this.$store.getters.getTeams
    },
    noTeam() {
      return this.$store.getters.getNoTeam
    },
    assessment() {
      return this.$store.getters.getAssessment
    },
  },
  created() {
  },
  methods: {
    updateAssessment(key, value) {
      const assessment = this.assessment
      assessment[key] = value
      //ls.storeAssessment(assessment, this.lsSuffix)
      this.$store.dispatch('updateAssessment', assessment)
    },
    getData(obj) {
      console.log(obj)
    },
    selectDepartment() {
      const departmentId = document.getElementById('setup-select-department').value
      const department = this.departments.find((d) => {
        return d.id == departmentId
      })
      this.updateAssessment('department', department)
    },
    selectTeam() {
      const teamId = team ? team : document.getElementById('setup-select-team').value
      const team = this.teams.find((t) => {
        return t.id == teamId
      })
      this.updateAssessment('team', team)
      this.members = team ? team.members : []
    },
    getMembers() {
      if (!this.server.multipleTeams) {
        this.members = this.noTeam.members
      }
      return this.members
    },
    selectMember() {
      const memberId = document.getElementById('setup-select-myname').value
      const member = this.members.find((m) => {
        return m.id = memberId
      })
      this.updateAssessment('member', member)
    },
    selectMonth() {
      const month = document.getElementById('setup-select-month').value
      this.updateAssessment('month', month)
    },
    selectQuarter() {
      const quarter = document.getElementById('setup-select-quarter').value
      this.updateAssessment('quarter', quarter)
    },
    selectYear() {
      const year = document.getElementById('setup-select-year').value
      this.updateAssessment('year', year)
    },
  }
}
</script>

<style lang="scss">
  .setup {
    table {
      font-size: x-large;
      margin: 0 auto;

      .search-results {
        border: 1px solid;
        position: absolute;
        z-index: 10;
        background-color: #fff;
      }
    }
  }
</style>
