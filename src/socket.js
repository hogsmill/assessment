import io from 'socket.io-client'
import bus from './EventBus'

const prod = location.hostname != 'localhost'

let asConnStr, connStr
if (!prod) {
  asConnStr = 'http://localhost:3099'
  connStr = 'http://localhost:3038'
} else {
  asConnStr = 'https://agilesimulations.co.uk:3099'
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

const connectToAgileSimulations = location.hostname != 'localhost'
let asSocket
if (connectToAgileSimulations) {
  console.log('Connecting to: ' + asConnStr)
  asSocket = io(asConnStr)
}

// Agile Simulations (login)

if (connectToAgileSimulations) {

  bus.$on('sendCheckLogin', (data) => { asSocket.emit('sendCheckLogin', data) })

  bus.$on('sendRating', (data) => { asSocket.emit('sendRating', data) })

  asSocket.on('loginSuccess', (data) => { bus.$emit('loginSuccess', data) })

  asSocket.on('logout', (data) => { bus.$emit('logout', data) })
}

// ------------------------------

socket.on('connect_error', (err) => { bus.$emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

// Send

bus.$on('sendCheckServer', (data) => { socket.emit('sendCheckServer', data) })

bus.$on('sendCheckSystem', (data) => { socket.emit('sendCheckSystem', data) })

bus.$on('sendLoadAllAssessmentsDone', (data) => { socket.emit('sendLoadAllAssessmentsDone', data) })

bus.$on('sendClearQuestions', (data) => { socket.emit('sendClearQuestions', data) })

bus.$on('sendLoadDepartments', (data) => { socket.emit('sendLoadDepartments', data) })

bus.$on('sendLoadTeams', (data) => { socket.emit('sendLoadTeams', data) })

bus.$on('sendCreateAssessment', (data) => { socket.emit('sendCreateAssessment', data) })

bus.$on('sendLoadAssessment', (data) => { socket.emit('sendLoadAssessment', data) })

bus.$on('sendAnswerQuestion', (data) => { bus.$emit('answerQuestion', data) })

bus.$on('sendSaveComment', (data) => { socket.emit('sendSaveComment', data) })

bus.$on('sendPrevQuestion', (data) => { socket.emit('sendPrevQuestion', data) })

bus.$on('sendNextQuestion', (data) => { socket.emit('sendNextQuestion', data) })

bus.$on('sendGoToResults', (data) => { bus.$emit('goToResults', data) })

bus.$on('sendShowQuestionComments', (data) => { bus.$emit('showQuestionComments', data) })

bus.$on('sendGetQuestionAnswers', (data) => { socket.emit('sendGetQuestionAnswers', data) })

bus.$on('sendSetAnswer', (data) => { socket.emit('sendSetAnswer', data) })

bus.$on('sendGetResults', (data) => { socket.emit('sendGetResults', data) })

bus.$on('sendResultsMailled', (data) => { socket.emit('sendResultsMailled', data) })

bus.$on('sendRestart', () => { socket.emit('sendRestart') })

// Facilitator

bus.$on('sendUpdateServer', (data) => { socket.emit('sendUpdateServer', data) })

bus.$on('sendAddDepartment', (data) => { socket.emit('sendAddDepartment', data) })

bus.$on('sendUpdateDepartmentName', (data) => { socket.emit('sendUpdateDepartmentName', data) })

bus.$on('sendDeleteDepartment', (data) => { socket.emit('sendDeleteDepartment', data) })

bus.$on('sendAddTeam', (data) => { socket.emit('sendAddTeam', data) })

bus.$on('sendUpdateTeamName', (data) => { socket.emit('sendUpdateTeamName', data) })

bus.$on('sendUpdateTeamDepartment', (data) => { socket.emit('sendUpdateTeamDepartment', data) })

bus.$on('sendDeleteTeam', (data) => { socket.emit('sendDeleteTeam', data) })

bus.$on('sendAddMember', (data) => { socket.emit('sendAddMember', data) })

bus.$on('sendMakeMainContact', (data) => { socket.emit('sendMakeMainContact', data) })

bus.$on('sendUpdateMemberDetails', (data) => { socket.emit('sendUpdateMemberDetails', data) })

bus.$on('sendDeleteMember', (data) => { socket.emit('sendDeleteMember', data) })

bus.$on('sendChangeTeam', (data) => { socket.emit('sendChangeTeam', data) })

bus.$on('sendDeleteAssessment', (data) => { socket.emit('sendDeleteAssessment', data) })

bus.$on('sendAssessmentsDone', (data) => { socket.emit('sendAssessmentsDone', data) })

bus.$on('sendAddQuestion', (data) => { socket.emit('sendAddQuestion', data) })

bus.$on('sendUpdateQuestion', (data) => { socket.emit('sendUpdateQuestion', data) })

bus.$on('sendUpdateQuestionInclude', (data) => { socket.emit('sendUpdateQuestionInclude', data) })

bus.$on('sendUpdateQuestionTitle', (data) => { socket.emit('sendUpdateQuestionTitle', data) })

bus.$on('sendUpdateQuestionGood', (data) => { socket.emit('sendUpdateQuestionGood', data) })

bus.$on('sendUpdateQuestionBad', (data) => { socket.emit('sendUpdateQuestionBad', data) })

bus.$on('sendUpdateQuestionLevel', (data) => { socket.emit('sendUpdateQuestionLevel', data) })

bus.$on('sendUpdateQuestionQuestion', (data) => { socket.emit('sendUpdateQuestionQuestion', data) })

bus.$on('sendUpdateQuestionDysfunction', (data) => { socket.emit('sendUpdateQuestionDysfunction', data) })

bus.$on('sendDeleteQuestion', (data) => { socket.emit('sendDeleteQuestion', data) })

// Receive

socket.on('loadServer', (data) => { bus.$emit('loadServer', data) })

socket.on('loadDepartments', (data) => { bus.$emit('loadDepartments', data) })

socket.on('loadTeams', (data) => { bus.$emit('loadTeams', data) })

socket.on('loadQuestions', (data) => { bus.$emit('loadQuestions', data) })

socket.on('loadAllAssessmentsDone', (data) => { bus.$emit('loadAllAssessmentsDone', data) })

socket.on('loadAssessment', (data) => { bus.$emit('loadAssessment', data) })

socket.on('loadWhosAnswered', (data) => { bus.$emit('loadWhosAnswered', data) })

socket.on('setQuestion', (data) => { bus.$emit('setQuestion', data) })

socket.on('loadTabularResults', (data) => { bus.$emit('loadTabularResults', data) })

socket.on('loadGraphResults', (data) => { bus.$emit('loadGraphResults', data) })

socket.on('loadExportResults', (data) => { bus.$emit('loadExportResults', data) })

socket.on('loadQuestionAnswers', (data) => { bus.$emit('loadQuestionAnswers', data) })

socket.on('loadAssessmentsDone', (data) => { bus.$emit('loadAssessmentsDone', data) })

export default bus
