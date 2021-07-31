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
      const assessment = JSON.parse(localStorage.getItem('assessment-' + this.lsSuffix))
      bus.$emit('sendLoadAssessment', assessment)
      this.$store.dispatch('updateState', 'questions')
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
