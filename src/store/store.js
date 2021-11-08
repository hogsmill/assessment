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
    teams: [],
    assessment: {},
    whosAnswered: [],
    questions: [],
    maturityQuestionAreas: [],
    maturityQuestionLevels: [],
    questionsInclude: [],
    dysfunctions: [],
    tabularResults: {},
    graphResults: {}
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
    getAllowComments: (state) => {
      const noComments = [
        '5 Dysfunctions'
      ]
      return noComments.indexOf(state.appType) < 0
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
    getQuestionsInclude: (state) => {
      return state.questionsInclude
    },
    getQuestions: (state) => {
      return state.questions.sort((a, b) => {
        return a.order - b.order
      })
    },
    getMaturityQuestionAreas: (state) => {
      return state.maturityQuestionAreas
    },
    getMaturityQuestionLevels: (state) => {
      return state.maturityQuestionLevels
    },
    getDysfunctions: (state) => {
      return state.dysfunctions
    },
    getTabularResults: (state) => {
      return state.tabularResults
    },
    getGraphResults: (state) => {
      return state.graphResults
    },
    getMyName: (state) => {
      return state.assessment.myName
    },
    getTeam: (state) => {
      return state.assessment.team
    },
    getMonth: (state) => {
      return state.assessment.month
    },
    getQuarter: (state) => {
      return state.assessment.quarter
    },
    getYear: (state) => {
      return state.assessment.year
    },
    getAssessment: (state) => {
      return state.assessment
    },
    getWhosAnswered: (state) => {
      return state.whosAnswered
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
      state.team = state.teams.length > 0 ? state.teams[0] : {}
    },
    updateQuestions: (state, payload) => {
      state.questions = payload
      console.log(state.questions)
      const areas = []
      const levels = {}
      if (state.questions.length && state.appType == 'Agile Maturity') {
        for (let i = 0; i < state.questions.length; i++) {
          if (areas.indexOf(state.questions[i].question.area) < 0) {
            areas.push(state.questions[i].question.area)
          }
        }
        for (let j = 1; j <= 5; j++) {
          levels[j] = {
            level: state.questions[0].question.levels[j].level
          }
        }
      }
      state.maturityQuestionAreas = areas
      state.maturityQuestionLevels = levels
    },
    toggleInclude: (state, payload) => {
      const questions = []
      for (let i = 0; i < state.questionsInclude.length; i++) {
        const question = state.questionsInclude[i]
        if (question.id == payload.id) {
          question.include = !question.include
        }
        questions.push(question)
      }
      state.questionsInclude = questions
    },
    updateDysfunctions: (state, payload) => {
      state.dysfunctions = payload
    },
    updateTabularResults: (state, payload) => {
      state.tabularResults = payload
      const questions = []
      const keys = Object.keys(state.tabularResults)
      for (let i = 0; i < keys.length; i++) {
        if (!state.questionsInclude.find((q) => {
          return q.id == keys[i]
        })) {
          questions.push({
            id: keys[i],
            question: state.tabularResults[keys[i]].question,
            include: true
          })
        }
      }
      state.questionsInclude = questions
    },
    updateGraphResults: (state, payload) => {
      state.graphResults = payload
    },
    updateTeam: (state, payload) => {
      const team = state.teams.find((t) => {
        return t.id == payload
      })
      state.team = team ? team : {}
    },
    updateAssessment: (state, payload) => {
      state.assessment = payload
    },
    updateWhosAnswered: (state, payload) => {
      state.whosAnswered = payload.members
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
    toggleInclude: ({ commit }, payload) => {
      commit('toggleInclude', payload)
    },
    updateDysfunctions: ({ commit }, payload) => {
      commit('updateDysfunctions', payload)
    },
    updateTabularResults: ({ commit }, payload) => {
      commit('updateTabularResults', payload)
    },
    updateGraphResults: ({ commit }, payload) => {
      commit('updateGraphResults', payload)
    },
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
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
    updateAssessment: ({ commit }, payload) => {
      commit('updateAssessment', payload)
    },
    updateWhosAnswered: ({ commit }, payload) => {
      commit('updateWhosAnswered', payload)
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
