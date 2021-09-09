
const { v4: uuidv4 } = require('uuid')

const fiveDysfunctionsFuns = require('./lib/fiveDysfunctions.js')
const teamHealthCheckFuns = require('./lib/teamHealthCheck.js')
const agileMaturityFuns = require('./lib/agileMaturity.js')
const scrumMasterFuns = require('./lib/scrumMaster.js')
const resultsFuns = require('./lib/results.js')

function newServer(appType) {
  const server = {
    id: uuidv4(),
    scope: 'individual',
    multipleTeams: false,
    autoNextQuestion: false,
    showTeamAnswers: false
  }
  switch(appType) {
    case '5 Dysfunctions':
      server.comments = false
      break
    default:
      server.comments = true
      break
  }
  return server
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

function newQuestion(data, comments) {
  const question = {
    id: uuidv4(),
    order: data.order,
    question: data.question,
    protected: data.protected,
    include: true
  }
  if (comments) {
    question.comments = []
  }
  return question
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
  const query = {
    month: null,
    quarter: null,
    year: null,
    organisation: null,
    name: null,
    email: null,
    team:  null,
    member: null
  }
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
  let query = {
    name: null,
    organisation: null,
    email: null,
    month: null,
    quarter: null,
    year: null,
    team: null,
    member: null
  }
  if (!scope) {
    query.name = assessment.name
    query.organisation = assessment.organisation
    query.email = assessment.email
  } else {
    if (scope.date == 'single') {
      query.month = assessment.month
      query.year = assessment.year
      query.quarter = assessment.quarter
    } else {
      delete query.month
      delete query.year
      delete query.quarter
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
        delete query.member
        break
      case 'organisation':
        delete query.team
        delete query.member
        break
    }
  }
  return query
}

function assessmentDate(assessment) {
  let label = assessment.year + '-'
  if (assessment.quarter) {
    label = label + 'Q' + assessment.quarter
  }
  if (assessment.month) {
    const month = assessment.month < 10 ? '0' + assessment.month : assessment.month
    label = label + month
  }
  return label
}

module.exports = {

  checkServer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('checkServer', data) }

    db.serverCollection.findOne({}, function(err, res) {
      if (err) throw err
      if (res) {
        _loadServer(db, io)
      } else {
        const server = newServer(data.appType)
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

    db.serverCollection.findOne({}, function(err, server) {
      if (err) throw err
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
            case 'Agile Maturity':
              questions = agileMaturityFuns.questions()
              break
            case 'Scrum Master':
              questions = scrumMasterFuns.questions()
              break
          }
          for (let i = 0, n = 1; i < questions.length; i++, n++) {
            data.question = questions[i]
            data.order = n
            data.protected = true
            const question = newQuestion(data, server.allowComments)
            db.questionCollection.insertOne(question, function(err, res) {
              if (err) throw err
              if (i == questions.length - 1) {
                _loadQuestions(db, io)
              }
            })
          }
        }
      })
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

  saveComment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('saveComment', data) }

    const query = _query(data.assessment)
    db.assessmentsCollection.findOne(query, function(err, res) {
      if (err) throw err
      const questions = []
      for (let i = 0; i < res.questions.length; i++) {
        const question = res.questions[i]
        const comments = question.comments ? question.comments : []
        if (question.id == data.questionId) {
          comments.push(data.comment)
        }
        question.comments = comments
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

    db.teamsCollection.find().toArray(function(err, teams) {
      if (err) throw err
      db.serverCollection.findOne({}, function(err, server) {
        if (err) throw err
        let query = _resultsQuery(data.assessment, data.scope)
        db.assessmentsCollection.find(query).toArray(function(err, res) {
          if (err) throw err
          let results
          switch (data.scope.format) {
            case 'table':
              results = resultsFuns.getTabular(res, server, teams, data.scope, data.appType)
              io.emit('loadTabularResults', results)
              break
            case 'graph':
              results = resultsFuns.getGraph(res, server, teams, data.scope, data.appType)
              io.emit('loadGraphResults', results)
              break
          }
        })
      })
    })
  },

  getQuestionAnswers: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getQuestionAnswers', data) }

    const scope = {
      date: 'single',
      member: 'team'
    }
    db.teamsCollection.findOne({id: data.assessment.team}, function(err, team) {
      if (err) throw err
      let query = _resultsQuery(data.assessment, scope)
      db.assessmentsCollection.find(query).toArray(function(err, res) {
        if (err) throw err
        let answers = []
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].questions.length; j++) {
            if (res[i].questions[j].id == data.questionId) {
              answers.push({
                answer: res[i].questions[j].answer,
                by: team.members.find((m) => {
                  return m.id == res[i].member.id
                }).name
              })
            }
          }
        }
        data.answers = answers
        io.emit('loadQuestionAnswers', data)
      })
    })
  },

  resultsMailled: function(db, io, data, debugOn) {

    if (debugOn) { console.log('resultsMailled', data) }
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

  assessmentsDone: function(db, io, data, debugOn) {

    if (debugOn) { console.log('assessmentsDone', data) }

    db.assessmentsCollection.find({'team.id': data.id}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const done = {
          labels: [],
          done: {}
        }
        for (let i = 0; i < res.length; i++) {
          const member = res[i].member
          const memberDone = done.done[member.id] ? done.done[member.id] : []
          const date = assessmentDate(res[i])
          const labels = done.labels
          if (labels.indexOf(date) < 0) {
            labels.push(date)
            done.labels = labels.sort()
          }
          memberDone.push(assessmentDate(res[i]))
          done.done[member.id] = memberDone.sort()
        }
        io.emit('loadAssessmentsDone', done)
      }
    })
  },

  addQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addQuestion', data) }

    db.serverCollection.findOne({}, function(err, server) {
      if (err) throw err
      db.questionCollection.find().toArray(function(err, res) {
        if (err) throw err
        if (res.length) {
          data.order = res.length + 1
          const question = newQuestion(data, server.allowComments)
          db.questionCollection.insertOne(question, function(err, res) {
            if (err) throw err
            _loadQuestions(db, io)
          })
        }
      })
    })
  },

  updateQuestionInclude: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateQuestionInclude', data) }

    db.questionCollection.findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        db.questionCollection.updateOne({id: data.id}, {$set: {include: data.include}}, function(err, res) {
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
