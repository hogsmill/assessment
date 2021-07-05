
const { v4: uuidv4 } = require('uuid')

const fiveDysfunctionsFuns = require('./lib/fiveDysfunctions.js')
const teamHealthCheckFuns = require('./lib/teamHealthCheck.js')

function newServer(data) {
  return  {
    id: uuidv4(),
    scope: 'individual',
    created: new Date().toISOString(),
    lastaccess: new Date().toISOString()
  }
}

function newTeam(data) {
  return  {
    id: uuidv4(),
    name: data.name,
    created: new Date().toISOString(),
    lastaccess: new Date().toISOString()
  }
}

function newQuestion(data) {
  return {
    id: uuidv4(),
    order: data.order,
    question: data.question,
    protected: data.protected,
    include: true
  }
}

function _loadServer(db, io) {
  db.serverCollection.findOne({}, function(err, res) {
    if (err) throw err
    io.emit('loadServer', res)
  })
}

function _loadTeams(db, io) {
  db.gameCollection.find().toArray( function(err, res) {
    if (err) throw err
    io.emit('loadTeams', res)
  })
}

function _loadQuestions(db, io) {
  db.questionCollection.find().toArray( function(err, res) {
    if (err) throw err
    io.emit('loadQuestions', res)
  })
}

module.exports = {

  checkServer: function(db, io, debugOn) {

    if (debugOn) { console.log('checkServer') }

    db.serverCollection.findOne({}, function(err, res) {
      if (err) throw err
      if (res) {
        _loadServer(db, io)
      } else {
        const server = newServer()
        db.serverCollection.insertOne(server, function(err, res) {
          if (err) throw err
          _loadServer(db, io)
        })
      }
    })
  },

  updateServerScope: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateServerScope', data) }

    db.serverCollection.updateOne({}, {$set: {scope: data.scope}}, function(err, res) {
      if (err) throw err
      _loadServer(db, io)
    })
  },

  checkSystem: function(db, io, data, debugOn) {

    if (debugOn) { console.log('checkSystem', data) }

    db.questionCollection.find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        _loadQuestions(db, io)
      } else {
        let questions = []
        switch(data.appType) {
          case '5 Dysfunctions':
            questions = fiveDysfunctionsFuns.get()
            break
          case 'Team Health Check':
            questions = teamHealthCheckFuns.get()
            break
        }
        for (let i = 0, n = 1; i < questions.length; i++, n++) {
          data.question = questions[i]
          data.order = n
          data.protected = true
          const question = newQuestion(data)
          db.questionCollection.insertOne(question, function(err, res) {
            if (err) throw err
            if (i == questions.length - 1) {
              _loadQuestions(db, io)
            }
          })
        }
      }
    })
  },

  loadTeams: function(db, io, debugOn) {

    if (debugOn) { console.log('loadTeams') }

    _loadTeams(db, io)
  },

  setAnswer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setAnswer', data) }

    db.questionCollection.updateOne({id: data.id}, {$set: {answer: data.answer}}, function(err, res) {
      if (err) throw err
      _loadQuestions(db, io)
    })
  },

  restart: function(db, io, debugOn) {

    if (debugOn) { console.log('restart') }

    db.questionCollection.find().toArray(function(err, qRes) {
      if (err) throw err
      if (qRes.length) {
        for (let i = 0; i < qRes.length; i++) {
          db.questionCollection.updateOne({'_id': qRes[i]._id}, {$set: {answer: null}}, function(err, res) {
            if (err) throw err
            if (i == qRes.length - 1) {
              _loadQuestions(db, io)
            }
          })
        }
      }
    })
  },

  addTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addTeam', data) }

    const team = newTeam(data)
    db.gameCollection.insertOne(team, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  updateTeamName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamName', data) }

    db.gameCollection.updateOne({id: data.id}, {$set: {name: data.name}}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  deleteTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteTeam', data) }

    db.gameCollection.deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  addQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addQuestion', data) }

    db.questionCollection.find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        data.order = res.length + 1
        const question = newQuestion(data)
        db.questionCollection.insertOne(question, function(err, res) {
          if (err) throw err
          _loadQuestions(db, io)
        })
      }
    })
  },

  updateQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateQuestion', data) }

    if (data.field) {
      db.questionCollection.findOne({id: data.id}, function(err, res) {
        if (err) throw err
        if (res) {
          const question = res.question
          question[data.field] = data.value
          db.questionCollection.updateOne({id: data.id}, {$set: {question: question}}, function(err, res) {
            if (err) throw err
            _loadQuestions(db, io)
          })
        }
      })
    } else {
      db.questionCollection.updateOne({id: data.id}, {$set: {question: data.question}}, function(err, res) {
        if (err) throw err
        _loadQuestions(db, io)
      })
    }
  },

  deleteQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteQuestion', data) }

    db.questionCollection.findOne({id: data.id}, function(err, delRes) {
      if (err) throw err
      const delOrder = delRes.order
      db.questionCollection.find().toArray(function(err, res) {
        if (err) throw err
        if (res.length) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].order >= delOrder) {
              db.questionCollection.updateOne({id: res[i].id}, {$set: {order: res[i].order - 1}}, function(err, res) {
                if (err) throw err
              })
            }
            if (res[i].id == data.id) {
              db.questionCollection.deleteOne({id: data.id}, function(err, res) {
                if (err) throw err
              })
            }
            if (i == res.length -1) {
              _loadQuestions(db, io)
            }
          }
        }
      })
    })
  }
}
