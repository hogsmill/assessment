
const { v4: uuidv4 } = require('uuid')

const fiveDysfunctionsFuns = require('./lib/fiveDysfunctions.js')
const teamHealthCheckFuns = require('./lib/teamHealthCheck.js')
const resultsFuns = require('./lib/results.js')

function newServer(data) {
  return  {
    id: uuidv4(),
    scope: 'individual',
    multipleTeams: false,
    autoNextQuestion: false
  }
}

function newTeam(data) {
  return  {
    id: uuidv4(),
    name: data.name,
    members: []
  }
}

function newMember(data) {
  return  {
    id: uuidv4(),
    name: data.name
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

function newAssessment(query) {
  query.created = new Date().toISOString()
  query.resultsEmailled = []
  return query
}

function _loadServer(db, io) {
  db.serverCollection.findOne({}, function(err, res) {
    if (err) throw err
    io.emit('loadServer', res)
  })
}

function _loadTeams(db, io) {
  db.teamsCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('loadTeams', res)
  })
}

function _loadQuestions(db, io) {
  db.questionCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('loadQuestions', res)
  })
}

function _loadAssessment(db, io, query) {

  db.assessmentsCollection.findOne(query, function(err, res) {
    if (err) throw err
    delete res._id
    res.team = res.team ? res.team.id : null
    res.member = res.member ? res.member.id : null
    io.emit('loadAssessment', res)
  })
}

function _query(data) {
  const query = {}
  if (data.month) {
    query.month = data.month
  }
  if (data.quarter) {
    query.quarter = data.quarter
  }
  if (data.year) {
    query.year = data.year
  }
  if (data.organisation) {
    query.organisation = data.organisation
  }
  if (data.name) {
    query.name = data.name
  }
  if (data.email) {
    query.email = data.email
  }
  if (data.team) {
    query.team = {
      id: data.team
    }
  }
  if (data.member) {
    query.member = {
      id: data.member
    }
  }
  return query
}

function _resultsQuery(assessment, scope) {
  let query = {}
  if (!scope) {
    query = {
      name: assessment.name,
      organisation: assessment.organisation,
      email: assessment.email
    }
  }
  if (scope.date == 'single') {
    query = {
      month: assessment.month,
      year: assessment.year,
      quarter: assessment.quarter
    }
  }
  if (scope.date == 'all') {
    query = {
      name: null,
      organisation: null,
      email: null
    }
  }
  switch(scope.member) {
    case 'individual':
      query.team = {
        id: assessment.team
      }
      query.member = {
        id: assessment.member
      }
      break
    case 'team':
      query.team = {
        id: assessment.team
      }
      break
  }
  return query
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
    const noTeam = '_No Team_'
    db.teamsCollection.findOne({name: noTeam}, function(err, res) {
      if (err) throw err
      if (res) {
        _loadTeams(db, io)
      } else {
        const team = newTeam({name: noTeam})
        db.teamsCollection.insertOne(team, function(err, res) {
          if (err) throw err
          _loadTeams(db, io)
        })
      }
    })
  },

  updateServer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateServer', data) }

    const update = {}
    update[data.field] = data.value
    db.serverCollection.updateOne({}, {$set: update}, function(err, res) {
      if (err) throw err
      _loadServer(db, io)
    })
  },

  clearQuestions: function(db, io, data, debugOn) {

    if (debugOn) { console.log('resetSystem', data) }

    db.questionCollection.drop(function(err, ) {
      if (err) throw err
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
            questions = fiveDysfunctionsFuns.questions()
            break
          case 'Team Health Check':
            questions = teamHealthCheckFuns.questions()
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

  loadAssessment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadAssessment', data) }

    let query = _query(data)
    db.assessmentsCollection.findOne(query, function(err, res) {
      if (err) throw err
      if (res) {
        _loadAssessment(db, io, query)
      } else {
        db.questionCollection.find().toArray(function(err, questions) {
          if (err) throw err
          query.questions = questions
          const assessment = newAssessment(query)
          db.assessmentsCollection.insertOne(assessment, function(err, res) {
            if (err) throw err
            query = _query(data)
            _loadAssessment(db, io, query)
          })
        })
      }
    })
  },

  setAnswer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setAnswer', data) }

    const query = _query(data.assessment)
    db.assessmentsCollection.findOne(query, function(err, res) {
      if (err) throw err
      const questions = []
      for (let i = 0; i < res.questions.length; i++) {
        const question = res.questions[i]
        if (question.id == data.questionId) {
          question.answer = data.answer
        }
        questions.push(question)
      }
      db.assessmentsCollection.updateOne({'_id': res._id}, {$set: {questions: questions}}, function(err, res) {
        if (err) throw err
        _loadAssessment(db, io, query)
      })
    })
  },

  getResults: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getResults', data) }

    db.serverCollection.findOne({}, function(err, server) {
      if (err) throw err
      let query = _resultsQuery(data.assessment, data.scope)
      db.assessmentsCollection.find(query).toArray(function(err, res) {
        if (err) throw err
        const results = resultsFuns.get(res, server, data.scope, data.appType)
        io.emit('loadResults', results)
      })
    })
  },

  resultsMailled: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getResults', data) }
    const query = _query(data.assessment)
    db.assessmentsCollection.findOne(query, function(err, res) {
      if (err) throw err
      const resultsEmailled = res.resultsEmailled
      resultsEmailled.push({
        date: new Date().toISOString(),
        results: data.results,
        assessment: data.assessment
      })
      db.assessmentsCollection.updateOne({'_id': res._id}, {$set: {resultsEmailled: resultsEmailled}}, function(err, ) {
        if (err) throw err
      })
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
    db.teamsCollection.insertOne(team, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  updateTeamName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamName', data) }

    db.teamsCollection.updateOne({id: data.id}, {$set: {name: data.name}}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  deleteTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteTeam', data) }

    db.teamsCollection.deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  addMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addMember', data) }

    const member = newMember(data)
    db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = res.members
        members.push(member)
        db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
          if (err) throw err
          _loadTeams(db, io)
        })
      }
    })
  },

  updateMemberName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateMemberName', data) }

    db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id == data.id) {
            member.name = data.name
          }
          members.push(res.members[i])
        }
        db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
          if (err) throw err
          _loadTeams(db, io)
        })
      }
    })
  },

  deleteMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteMember', data) }

    db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          if (res.members[i].id != data.id) {
            members.push(res.members[i])
          }
        }
        db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
          if (err) throw err
          _loadTeams(db, io)
        })
      }
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
