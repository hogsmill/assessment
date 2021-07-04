
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'
const port = prod ? process.env.VUE_APP_PORT : 3038
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'fiveDysfunctions'
const questionCollection =  prod ? process.env.VUE_APP_QUESTION_COLLECTION : 'fiveDysfunctionsQuestions'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})


let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 2000

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

let db
MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, (err, client) => {
  if (err) throw err
  db = client.db('db')

  db.createCollection(gameCollection, function(error, collection) {})
  db.createCollection(questionCollection, function(error, collection) {})

  db.gameCollection = db.collection(gameCollection)
  db.questionCollection = db.collection(questionCollection)

  io.on('connection', (socket) => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] ? connections[connection] + 1 : 1
    if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      const connection = socket.handshake.headers.host
      connections[connection] = connections[connection] - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    })


    socket.on('sendCheckSystem', (data) => { dbStore.checkSystem(db, io, data, debugOn) })

    socket.on('sendLoadTeams', () => { dbStore.loadTeams(db, io, debugOn) })

    socket.on('sendSetAnswer', (data) => { dbStore.setAnswer(db, io, data, debugOn) })

    // Facilitator

    socket.on('sendAddTeam', (data) => { dbStore.addTeam(db, io, data, debugOn) })

    socket.on('sendUpdateTeamName', (data) => { dbStore.updateTeamName(db, io, data, debugOn) })

    socket.on('sendDeleteTeam', (data) => { dbStore.deleteTeam(db, io, data, debugOn) })

    socket.on('sendAddQuestion', (data) => { dbStore.addQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateQuestion', (data) => { dbStore.updateQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateQuestionTitle', (data) => { data.field = 'title'; dbStore.updateQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateQuestionGood', (data) => { data.field = 'good'; dbStore.updateQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateQuestionBad', (data) => { data.field = 'bad'; dbStore.updateQuestion(db, io, data, debugOn) })

    socket.on('sendDeleteQuestion', (data) => { dbStore.deleteQuestion(db, io, data, debugOn) })

  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
