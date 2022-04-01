<template>
  <div id="app" class="mb-4">
    <Header />
    <ClearStorage />
    <RateThisGame />
    <ConnectionError />
    <div v-if="currentTab == 'facilitator'">
      <FacilitatorView />
    </div>
    <div v-if="currentTab == 'game'" class="main">
      <h1>
        {{ appType }}
        <span v-if="server.scope == 'organisation' && !server.multipleTeams && team"> for {{ team.name }}</span>
        <i class="fas fa-undo" @click="restart()" />
      </h1>
      <WalkThrough />
      <Intro v-if="state == 'intro'" />
      <Questions v-if="state == 'questions'" />
      <Results v-if="server.scope == 'individual' && state == 'results'" :summary="false" />
    </div>
    <Results v-if="currentTab == 'results'" :summary="true" />
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import ls from './lib/localStorage.js'
import params from './lib/params.js'
import appTypeFuns from './lib/appType.js'
import assessmentFuns from './lib/assessment.js'

import Header from './components/Header.vue'
import Modals from './components/Modals.vue'
import WalkThrough from './components/WalkThrough.vue'

import RateThisGame from './components/RateThisGame.vue'
import ClearStorage from './components/ClearStorage.vue'
import ConnectionError from './components/error/ConnectionError.vue'

import FacilitatorView from './components/FacilitatorView.vue'

import Intro from './components/assessment/Intro.vue'
import Questions from './components/assessment/Questions.vue'
import Results from './components/assessment/Results.vue'

export default {
  name: 'App',
  components: {
    Header,
    ClearStorage,
    RateThisGame,
    ConnectionError,
    WalkThrough,
    FacilitatorView,
    Intro,
    Questions,
    Results,
    Modals
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    appType() {
      return this.$store.getters.appType
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    state() {
      return this.$store.getters.getGameState
    },
    server() {
      return this.$store.getters.getServer
    },
    assessment() {
      return this.$store.getters.getAssessment
    },
    team() {
      return this.$store.getters.getTeam
    },
    modals() {
      return this.$store.getters.getModals
    }
  },
  created() {
    bus.on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    this.$store.dispatch('localStorageStatus', ls.check())

    const scope = appTypeFuns.scope('organisation')
    const appType = appTypeFuns.get('5 Dysfunctions')

    console.log('SCOPE:', scope)
    
    this.$store.dispatch('updateAppType', appType)

    bus.emit('sendCheckServer', {appType: appType})
    bus.emit('sendCheckSystem', {appType: appType})

    bus.emit('sendLoadDepartments')
    bus.emit('sendLoadTeams')

    if (location.hostname == 'localhost' && params.isParam('host')) {
      this.$store.dispatch('updateAdmin', true)
    }

    if (params.isParam('walkThrough')) {
      this.$store.dispatch('showModal', 'walkThrough')
    }

    const assessment = ls.getAssessment(this.lsSuffix)
    if (assessment) {
      this.$store.dispatch('updateAssessment', assessment)
      bus.emit('sendLoadAssessment', assessment)
    }

    bus.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.on('loadServer', (data) => {
      this.$store.dispatch('updateServer', data)
    })

    bus.on('loadTeams', (data) => {
      console.log('loadTeams', data)
      this.$store.dispatch('updateTeams', data)
    })

    bus.on('loadDepartments', (data) => {
      this.$store.dispatch('updateDepartments', data)
    })

    bus.on('loadQuestions', (data) => {
      this.$store.dispatch('updateQuestions', data)
    })

    bus.on('loadAssessment', (data) => {
      if (assessmentFuns.isThisAssessment(data, this.assessment)) {
        this.$store.dispatch('updateAssessment', data)
      }
    })

    bus.on('loadWhosAnswered', (data) => {
      if (data.teamId == this.assessment.team.id) {
        this.$store.dispatch('updateWhosAnswered', data)
      }
    })
  },
  methods: {
    restart() {
      if (confirm('Restart this assessment')) {
        bus.emit('sendRestart')
        this.$store.dispatch('updateState', 'intro')
      }
    }
  }
}
</script>

<style lang="scss">
  .main {
    max-width: 800px;
    margin: 0 auto;
  }

  .fa-undo {
    font-size: smaller;
    color: #888;
    margin-left: 12px;

    &:hover {
      color: #444;
    }
  }
</style>
