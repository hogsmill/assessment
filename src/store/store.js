import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getContext(state, context) {
  return context == 'switching' ? state.switching : state.noSwitching
}

export const store = new Vuex.Store({
  state: {
    thisGame: '5 Dysfunctions',
    appType: '5 Dysfunctions',
    session: null,
    userName: '',
    admin: false,
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    currentTab: 'game',
    walkThrough: false,
    server: {},
    gameName: '',
    state: 'intro',
    assessmentId: null,
    assessment: {},
    team: null,
    month: null,
    quarter: null,
    year: null,
    teams: [],
    questions: [],
    dysfunctions: [],
    results: {}
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getSession: (state) => {
      return state.session
    },
    getUserName: (state) => {
      return state.userName
    },
    getAdmin: (state) => {
      return state.admin
    },
    lsSuffix: (state) => {
      let suffix = ''
      switch (state.appType) {
        case '5 Dysfunctions':
          suffix = 'fd'
          break
        case 'Team Health Check':
          suffix = 'hc'
          break
      }
      return suffix
    },
    appType: (state) => {
      return state.appType
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getServer: (state) => {
      return state.server
    },
    getGameName: (state) => {
      return state.gameName
    },
    getGameState: (state) => {
      return state.state
    },
    getNoTeam: (state) => {
      const team = state.teams.find((t) => {
        return t.name == '_No Team_'
      })
      return team ? team : {}
    },
    getTeams: (state) => {
      const teams = []
      for (let i = 0; i < state.teams.length; i++) {
        if (state.teams[i].name != '_No Team_') {
          teams.push(state.teams[i])
        }
      }
      return teams
    },
    getQuestions: (state) => {
      return state.questions.sort((a, b) => {
        return a.order - b.order
      })
    },
    getDysfunctions: (state) => {
      return state.dysfunctions
    },
    getResults: (state) => {
      return state.results
    },
    getTeam: (state) => {
      return state.team
    },
    getMonth: (state) => {
      return state.month
    },
    getQuarter: (state) => {
      return state.quarter
    },
    getYear: (state) => {
      return state.year
    },
    getAssessmentId: (state) => {
      return state.assessmentId
    },
    getAssessment: (state) => {
      return state.assessment
    },
    getConnections: (state) => {
      return state.connections
    },
    getConnectionError: (state) => {
      return state.connectionError
    },
    getLocalStorageStatus: (state) => {
      return state.localStorageStatus
    },
    getLastAccessed: (state) => {
      return state.lastaccess
    }
  },
  mutations: {
    updateAppType: (state, payload) => {
      state.appType = payload
      state.thisGame = payload
    },
    updateLogin: (state, payload) => {
      state.session = payload.session
      state.userName = payload.userName
      state.admin = payload.loggedInAsAdmin
    },
    updateAdmin: (state, payload) => {
      state.admin = payload
    },
    updateServer: (state, payload) => {
      state.server = payload
    },
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateState: (state, payload) => {
      state.state = payload
    },
    updateTeams: (state, payload) => {
      state.teams = payload
    },
    updateQuestions: (state, payload) => {
      state.questions = payload
    },
    updateDysfunctions: (state, payload) => {
      state.dysfunctions = payload
    },
    updateResults: (state, payload) => {
      state.results = payload
    },
    updateTeam: (state, payload) => {
      state.team = payload
    },
    updateMonth: (state, payload) => {
      state.month = payload
    },
    updateQuarter: (state, payload) => {
      state.quarter = payload
    },
    updateYear: (state, payload) => {
      state.year = payload
    },
    updateAssessmentId: (state, payload) => {
      state.assessmentId = payload
    },
    updateAssessment: (state, payload) => {
      state.assessment = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    updateConnectionError: (state, payload) => {
      state.connectionError = payload
    },
    localStorageStatus: (state, payload) => {
      state.localStorageStatus = payload
    }
  },
  actions: {
    updateAppType: ({ commit }, payload) => {
      commit('updateAppType', payload)
    },
    updateLogin: ({ commit }, payload) => {
      commit('updateLogin', payload)
    },
    updateUserName: ({ commit }, payload) => {
      commit('updateUserName', payload)
    },
    updateAdmin: ({ commit }, payload) => {
      commit('updateAdmin', payload)
    },
    updateServer: ({ commit }, payload) => {
      commit('updateServer', payload)
    },
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateState: ({ commit }, payload) => {
      commit('updateState', payload)
    },
    updateTeams: ({ commit }, payload) => {
      commit('updateTeams', payload)
    },
    updateQuestions: ({ commit }, payload) => {
      commit('updateQuestions', payload)
    },
    updateDysfunctions: ({ commit }, payload) => {
      commit('updateDysfunctions', payload)
    },
    updateResults: ({ commit }, payload) => {
      commit('updateResults', payload)
    },
    updateTeam: ({ commit }, payload) => {
      commit('updateTeam', payload)
    },
    updateMonth: ({ commit }, payload) => {
      commit('updateMonth', payload)
    },
    updateQuarter: ({ commit }, payload) => {
      commit('updateQuarter', payload)
    },
    updateYear: ({ commit }, payload) => {
      commit('updateYear', payload)
    },
    updateAssessmentId: ({ commit }, payload) => {
      commit('updateAssessmentId', payload)
    },
    updateAssessment: ({ commit }, payload) => {
      commit('updateAssessment', payload)
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    },
    updateConnectionError: ({ commit }, payload) => {
      commit('updateConnectionError', payload)
    },
    localStorageStatus: ({ commit }, payload) => {
      commit('localStorageStatus', payload)
    }
  }
})
