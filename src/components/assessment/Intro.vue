<template>
  <div>
    <Intro5Dysfunctions v-if="appType == '5 Dysfunctions'" />
    <IntroTeamHealthCheck v-if="appType == 'Team Health Check'" />
    <IntroAgileMaturity v-if="appType == 'Agile Maturity'" />
    <IntroScrumMaster v-if="appType == 'Scrum Master'" />
    <Details v-if="server.scope == 'individual'" />
    <SetUp v-if="server.scope == 'organisation'" />
    <div v-if="server.scope == 'organisation'">
      <button class="btn btn-info" @click="startAssessmentOrganisation()">
        <span>
          Start
        </span>
      </button>
    </div>
    <div v-if="server.scope == 'individual'">
      <button class="btn btn-info" @click="startAssessmentIndividual()">
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

import IntroAgileMaturity from './agileMaturity/Intro.vue'
import Intro5Dysfunctions from './fiveDysfunctions/Intro.vue'
import IntroTeamHealthCheck from './teamHealthCheck/Intro.vue'
import IntroScrumMaster from './scrumMaster/Intro.vue'
import Details from './Details.vue'
import SetUp from './SetUp.vue'

export default {
  components: {
    IntroAgileMaturity,
    Intro5Dysfunctions,
    IntroTeamHealthCheck,
    IntroScrumMaster,
    Details,
    SetUp
  },
  data() {
    return {
      setUp: false
    }
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
    setUpOk(assessment) {
      if (this.server.scope == 'individual') {
        this.setUp = assessment.email && assessment.organisation && assessment.email
      } else {
        let setUp = assessment.member
        if (this.server.frequency == 'monthly') {
          setUp = setUp && assessment.month && assessment.year
        } else if (this.server.frequency == 'quarterly') {
          setUp = setUp && assessment.month && assessment.quarter
        }
        if (this.server.multipleTeams) {
          setUp = setUp && assessment.team
        }
        this.setUp = setUp
      }
      return this.setUp
    },
    startAssessmentOrganisation() {
      //const assessment = JSON.parse(localStorage.getItem('assessment-' + this.lsSuffix))
      const team = document.getElementById('setup-select-team').value
      const member = document.getElementById('setup-select-myname').value
      let month, quarter, year
      if (this.server.frequency == 'monthly') {
        month = document.getElementById('setup-select-month').value
      }
      if (this.server.frequency == 'quarterly') {
        quarter = document.getElementById('setup-select-quarter').value
      }
      if (this.server.frequency != 'oneoff') {
        year = document.getElementById('setup-select-year').value
      }
      const assessment = {
        team: team,
        member: member,
        month: month,
        quarter: quarter,
        year: year
      }
      if (!this.setUpOk(assessment)) {
        alert('Please complete all fields')
      } else {
        this.$store.dispatch('updateAssessment', assessment)
        bus.$emit('sendLoadAssessment', assessment)
        this.$store.dispatch('updateState', 'questions')
      }
    },
    startAssessmentIndividual() {
      const name = document.getElementById('details-name').value
      const organisation = document.getElementById('details-organisation').value
      const email = document.getElementById('details-email').value
      const assessment = {
        name: name,
        organisation: organisation,
        email: email
      }
      if (!this.setUpOk(assessment)) {
        alert('Please complete all fields')
      } else {
        ls.storeAssessment(assessment, this.lsSuffix)
        this.$store.dispatch('updateAssessment', assessment)
        bus.$emit('sendLoadAssessment', assessment)
        this.$store.dispatch('updateState', 'questions')
      }
    }
  }
}
</script>
