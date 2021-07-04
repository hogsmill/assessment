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
    host: false,
    gameName: '',
    teams: [],
    questions: []
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
    getGameName: (state) => {
      return state.gameName
    },
    getTeams: (state) => {
      return state.teams
    },
    getQuestions: (state) => {
      return state.questions.sort((a, b) => {
        return a.order - b.order
      })
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
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateTeams: (state, payload) => {
      state.teams = payload
    },
    updateQuestions: (state, payload) => {
      state.questions = payload
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
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateTeams: ({ commit }, payload) => {
      commit('updateTeams', payload)
    },
    updateQuestions: ({ commit }, payload) => {
      commit('updateQuestions', payload)
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
