<template>
  <div>
    <Intro5Dysfunctions v-if="appType == '5 Dysfunctions'" />
    <IntroTeamHealthCheck v-if="appType == 'Team Health Check'" />
    <Details v-if="server.scope == 'individual'" />
    <SetUp v-if="server.scope == 'organisation'" />
    <div>
      <button class="btn btn-info" @click="setState('questions')" :disabled="!setUp()">
        <span v-if="!assessment">Start</span>
        <span v-if="assessment">Continue</span>
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import session from '../../lib/session.js'

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
    },
    team() {
      return this.$store.getters.getTeam
    },
    month() {
      return this.$store.getters.getMonth
    },
    quarter() {
      return this.$store.getters.getQuarter
    },
    year() {
      return this.$store.getters.getYear
    },
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    setUp() {
      const setUp = true
      return setUp
    },
    setState(state) {
      session.create(this.$store, bus, this.lsSuffix, this.team, this.month, this.quarter, this.year)
      this.$store.dispatch('updateState', 'questions')
    }
  }
}
</script>
