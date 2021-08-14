<template>
  <div>
    <Intro5Dysfunctions v-if="appType == '5 Dysfunctions'" />
    <IntroTeamHealthCheck v-if="appType == 'Team Health Check'" />
    <Details v-if="server.scope == 'individual'" />
    <SetUp v-if="server.scope == 'organisation'" />
    <div v-if="server.scope == 'organisation'">
      <button class="btn btn-info" @click="startAssessmentOrganisation()" :disabled="!setUp()">
        <span>
          Start
        </span>
      </button>
    </div>
    <div v-if="server.scope == 'individual'">
      <button class="btn btn-info" @click="startAssessmentIndividual()" :disabled="!setUp()">
        <span>
          Start
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import ls from '../../lib/localStorage.js'

import Intro5Dysfunctions from './fiveDysfunctions/Intro.vue'
import IntroTeamHealthCheck from './teamHealthCheck/Intro.vue'
import Details from './Details.vue'
import SetUp from './SetUp.vue'

export default {
  components: {
    Intro5Dysfunctions,
    IntroTeamHealthCheck,
    Details,
    SetUp
  },
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    server() {
      return this.$store.getters.getServer
    },
    appType() {
      return this.$store.getters.appType
    }
  },
  methods: {
    setUp() {
      const setUp = true
      return setUp
    },
    startAssessmentOrganisation() {
      //const assessment = JSON.parse(localStorage.getItem('assessment-' + this.lsSuffix))
      const team = document.getElementById('setup-select-team').value
      const member = document.getElementById('setup-select-myname').value
      let month, quarter
      if (this.server.frequency == 'monthly') {
        month = document.getElementById('setup-select-month').value
      }
      if (this.server.frequency == 'quarterly') {
        quarter = document.getElementById('setup-select-quarter').value
      }
      const year = document.getElementById('setup-select-year').value
      if (!team || !member || (!month && !quarter) || !year) {
        alert('Please complete all fields')
      } else {
        const assessment = {
          team: team,
          member: member,
          month: month,
          quarter: quarter,
          year: year
        }
        this.$store.dispatch('updateAssessment', assessment)
        bus.$emit('sendLoadAssessment', assessment)
        this.$store.dispatch('updateState', 'questions')
      }
    },
    startAssessmentIndividual() {
      const name = document.getElementById('details-name').value
      const organisation = document.getElementById('details-organisation').value
      const email = document.getElementById('details-email').value
      if (!name || !organisation || ! email) {
        alert('Please complete all fields')
      } else {
        const assessment = {
          name: name,
          organisation: organisation,
          email: email
        }
        ls.storeAssessment(assessment, this.lsSuffix)
        this.$store.dispatch('updateAssessment', assessment)
        bus.$emit('sendLoadAssessment', assessment)
        this.$store.dispatch('updateState', 'questions')
      }
    }
  }
}
</script>
