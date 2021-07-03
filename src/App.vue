<template>
  <div id="app" class="mb-4">
    <Header />
    <ClearStorage />
    <ConnectionError />
    <GameName />
    <WalkThroughView />
    <div v-if="currentTab == 'facilitator'">
      <FacilitatorView />
    </div>
    <div v-if="currentTab == 'game'" class="main">
      <h1>
        Game: {{ gameName }}
        <i class="fas fa-undo" @click="restart()" />
      </h1>
      <div class="container">
        <Intro />
      </div>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import io from 'socket.io-client'

import ls from './lib/localStorage.js'
import params from './lib/params.js'
import appTypeFuns from './lib/appType.js'

import Header from './components/Header.vue'
import ClearStorage from './components/ClearStorage.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import ConnectionError from './components/error/ConnectionError.vue'

import FacilitatorView from './components/FacilitatorView.vue'
import GameName from './components/GameName.vue'
import Intro from './components/game/Intro.vue'

export default {
  name: 'App',
  components: {
    Header,
    ClearStorage,
    WalkThroughView,
    ConnectionError,
    FacilitatorView,
    GameName,
    Intro
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    },
    appType() {
      return this.$store.getters.appType
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  created() {
    bus.$on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    this.$store.dispatch('localStorageStatus', ls.check())

    const appType = appTypeFuns.get('5 Dysfunctions')
    this.$store.dispatch('updateAppType', appType)

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

    bus.$on('loadTeams', (data) => {
      this.$store.dispatch('updateTeams', data)
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
      console.log('restarting')
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
