<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="https://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <h1 class="app-name" v-if="appName">
        {{ appName }}
      </h1>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{ active: currentTab == 'game' }">
          <a class="nav-link pointer" @click="setCurrentTab('game')">Assessment</a>
        </li>
        <li v-if="server.nonAdminResults" class="nav-item" :class="{ active: currentTab == 'results' }">
          <a class="nav-link pointer" @click="setCurrentTab('results')">Results</a>
        </li>
        <li v-if="admin" class="nav-item" :class="{ active: currentTab == 'facilitator' }">
          <a class="nav-link pointer" @click="setCurrentTab('facilitator')">Facilitator</a>
        </li>
        <li class="nav-item">
          <a class="nav-link pointer" @click="show()">Feedback</a>
        </li>
        <li class="nav-item logged-in">
          <a class="nav-link pointer">
            <i v-if="!session" class="fas fa-handshake-slash" title="Not logged in" />
            <i v-if="session && !admin" class="far fa-handshake" :title="'Logged in as ' + userName" />
            <i v-if="session && admin" class="fas fa-handshake" :title="'Logged in as ' + userName + ' (Admin)'" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import bus from '../socket.js'

import mailFuns from '../lib/mail.js'

export default {
  data() {
    return {
      connectToAgileSimulations: location.hostname != 'localhost'
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    session() {
      return this.$store.getters.getSession
    },
    userName() {
      return this.$store.getters.getUserName
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    assessment() {
      return this.$store.getters.getAssessment
    },
    server() {
      return this.$store.getters.getServer
    }
  },
  created() {
    this.appName = process.env.VUE_APP_NAME

    let session = localStorage.getItem('session-agilesimulations')
    if (session) {
      session = JSON.parse(session)
      bus.emit('sendCheckLogin', {id: this.id, session: session})
    } else {
      this.clearLogin()
    }

    bus.on('loginSuccess', (data) => {
      this.$store.dispatch('updateLogin', data)
    })

    bus.on('logout', () => {
      this.clearLogin()
    })
  },
  methods: {
    clearLogin() {
      if (this.connectToAgileSimulations) {
        const data = {session: '', userName: '', loggedInAsAdmin: false}
        this.$store.dispatch('updateLogin', data)
      }
    },
    setCurrentTab(payload) {
      if (payload == 'results' && !this.assessment.created) {
        alert('You must select an assessment (e.g. team, member, dates...) to view the results')
      } else {
        this.$store.dispatch('updateCurrentTab', payload)
      }
    },
    updateShowAbout(payload) {
      this.$store.dispatch('updateShowAbout', payload)
    },
    show() {
      this.$store.dispatch('showModal', 'feedback')
    }
  }
}
</script>

<style lang="scss">
  nav {
    h1 {
      letter-spacing: initial;
      margin-left: 6px;
      font-weight: bold;
      text-shadow: 2px 2px 3px #444;
      font-size: xx-large;
      line-height: 1;
    }

    .feedback {
      letter-spacing: 0;
      color: #212529;
    }

    p.feedback-form {
      margin-bottom: 12px;
    }

    .feedback-form {
      width: 80%;
      margin: 0 auto;
    }
  }
</style>
