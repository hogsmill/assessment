<template>
  <div id="app" class="mb-4">
    <Header />
    <ClearStorage />
    <ConnectionError />
    <WalkThroughView v-if="server.scope == 'individual'" />
    <div v-if="currentTab == 'facilitator'">
      <FacilitatorView />
    </div>
    <div v-if="currentTab == 'game'" class="main">
      <h1>
        {{ appType }}
        <i class="fas fa-undo" @click="restart()" />
      </h1>
      <Intro v-if="state == 'intro'" />
      <Questions v-if="state == 'questions'" />
      <Results v-if="state == 'results'" />
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import io from 'socket.io-client'

import ls from './lib/localStorage.js'
import params from './lib/params.js'
import appTypeFuns from './lib/appType.js'
import session from './lib/session.js'

import Header from './components/Header.vue'
import ClearStorage from './components/ClearStorage.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
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
    WalkThroughView,
    ConnectionError,
    FacilitatorView,
    Intro,
    Questions,
    Results
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
    assessmentId() {
      return this.$store.getters.getAssessmentId
    }
  },
  created() {
    bus.$on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    this.$store.dispatch('localStorageStatus', ls.check())

    const appType = appTypeFuns.get('5 Dysfunctions')
    this.$store.dispatch('updateAppType', appType)

    session.store(this.$store, bus, this.lsSuffix)

    bus.$emit('sendCheckSystem', {appType: appType})
    bus.$emit('sendCheckServer')

    bus.$emit('sendLoadTeams')

    if (location.hostname == 'localhost' && params.isParam('host')) {
      this.$store.dispatch('updateAdmin', true)
    }

    if (params.getParam('game')) {
      this.$store.dispatch('updateGameName', params.getParam('game'))
    }

    bus.$on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.$on('loadServer', (data) => {
      this.$store.dispatch('updateServer', data)
    })

    bus.$on('loadTeams', (data) => {
      this.$store.dispatch('updateTeams', data)
    })

    bus.$on('loadQuestions', (data) => {
      this.$store.dispatch('updateQuestions', data)
    })

    bus.$on('loadAssessment', (data) => {
      if (data && data.id == this.assessmentId) {
        this.$store.dispatch('updateAssessment', data)
      }
    })
  },
  methods: {
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    saveGameName: function() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      this.hide()
    },
    setContext(context) {
      bus.$emit('sendSetContext', {gameName: this.gameName, context: context})
    },
    restart() {
      if (confirm('Restart this assessment')) {
        session.clear(this.$store, this.lsSuffix)
        bus.$emit('sendRestart')
        this.$store.dispatch('updateState', 'intro')
      }
    }
  }
}
</script>

<style lang="scss">
  .context {
    text-align: center;
    margin-bottom: 24px;
  }

  .fa-brain {
    margin-right: 36px;
    color: darksalmon;
    display: inline-block;
    text-shadow: 1px 1px 1px #888;
  }
  .fa-undo {
    font-size: smaller;
    color: #888;

    &:hover {
      color: #444;
    }
  }

  .plates {
    margin: 36px auto 0 auto;
    height: 450px;
    width: 800px;
    max-width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: top;
    background-image: url("./assets/img/plates.png");
  }
</style>
