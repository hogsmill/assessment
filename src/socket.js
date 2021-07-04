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

  asSocket.on('loginSuccess', (data) => { bus.$emit('loginSuccess', data) })

  asSocket.on('logout', (data) => { bus.$emit('logout', data) })
}

// ------------------------------

socket.on('connect_error', (err) => { bus.$emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

// Send

bus.$on('sendCheckSystem', (data) => { socket.emit('sendCheckSystem', data) })

bus.$on('sendLoadTeams', (data) => { socket.emit('sendLoadTeams', data) })

// Facilitator

bus.$on('sendAddTeam', (data) => { socket.emit('sendAddTeam', data) })

bus.$on('sendUpdateTeamName', (data) => { socket.emit('sendUpdateTeamName', data) })

bus.$on('sendDeleteTeam', (data) => { socket.emit('sendDeleteTeam', data) })

bus.$on('sendAddQuestion', (data) => { socket.emit('sendAddQuestion', data) })

bus.$on('sendUpdateQuestion', (data) => { socket.emit('sendUpdateQuestion', data) })

bus.$on('sendDeleteQuestion', (data) => { socket.emit('sendDeleteQuestion', data) })

// Receive

socket.on('loadTeams', (data) => { bus.$emit('loadTeams', data) })

socket.on('loadQuestions', (data) => { bus.$emit('loadQuestions', data) })

export default bus
