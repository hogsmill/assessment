
const { v4: uuidv4 } = require('uuid')

const fiveDysfunctionsFuns = require('./lib/fiveDysfunctions.js')
const teamHealthCheckFuns = require('./lib/teamHealthCheck.js')
const agileMaturityFuns = require('./lib/agileMaturity.js')
const scrumMasterFuns = require('./lib/scrumMaster.js')
const resultsFuns = require('./lib/results.js')

let serverScope = null

function newServer(appType) {
  const server = {
    id: uuidv4(),
    scope: 'individual',
    useOrganisationModel: 'false',
    multipleTeams: false,
    autoNextQuestion: false,
    showTeamAnswers: false,
    language: 'uk-english'
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

function newDepartment(data) {
  return  {
    id: uuidv4(),
    name: data.name,
    teams: [],
    members: []
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
    serverScope = res.scope
    io.emit('loadServer', res)
  })
}

function _loadDepartments(db, io) {
  db.departmentsCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('loadDepartments', res)
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
    res.team = res.team ? res.team : null
    res.member = res.member ? res.member : null
    io.emit('loadAssessment', res)
    if (res.team && res.member) {
      _loadWhosAnswered(db, io, query)
    }
  })
}

function _loadWhosAnswered(db, io, query) {
  if (serverScope != 'individual') {
    delete query.member
    db.assessmentsCollection.find(query).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const members = []
        for (let i = 0; i < res.length; i++) {
          const member = {
            id: res[i].member.id,
            questions: {}
          }
          for (let j = 0; j < res[i].questions.length; j++) {
            const question = res[i].questions[j]
            member.questions[question.id] = typeof(question.answer) != 'undefined'
          }
          members.push(member)
        }
        io.emit('loadWhosAnswered', {teamId: query.team.id, members: members})
      }
    })
  }
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
    query.team = data.team
  }
  if (data.member) {
    query.member = data.member
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
  if (scope.server == 'individual') {
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
        query.team = assessment.team
        query.member = assessment.member
        break
      case 'department':
        query.department = assessment.department
        delete query.team
        delete query.member
        break
      case 'team':
        query.team = assessment.team
        delete query.member
        break
      case 'organisation':
        delete query.department
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

function _allAssessmentsDone(db, io, data, debugOn) {

  db.assessmentsCollection.find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      const done = {
        labels: [],
        done: {}
      }
      for (let i = 0; i < res.length; i++) {
        if (res[i].member) {
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
      }
      io.emit('loadAllAssessmentsDone', done)
    }
  })
}

function _assessmentsDone(db, io, data, debugOn) {

  const query = data.departmentId ? {'department.id': data.departmentId} : {'team.id': data.teamId}
  db.assessmentsCollection.find(query).toArray(function(err, res) {
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
              questions = fiveDysfunctionsFuns.questions(server.language, global.route)
              break
            case 'Team Health Check':
              questions = teamHealthCheckFuns.questions(server.language, global.route)
              break
            case 'Agile Maturity':
              questions = agileMaturityFuns.questions(server.language, global.route)
              break
            case 'Scrum Master':
              questions = scrumMasterFuns.questions(server.language, global.route)
              break
          }
          for (let i = 0, n = 1; i < questions.length; i++, n++) {
            data.question = questions[i]
            data.order = n
            data.protected = true
            const question = newQuestion(data, server.comments)
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

  getSearchResults: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getSearchResults', data) }

    db.organisationCollection.find({isMember: true}).toArray(function(err, res) {
      if (err) throw err
      const results = []
      for (let i = 0; i < res.length; i++) {
        const query = data.query.toLowerCase()
        const name = res[i].name.toLowerCase()
        if (name.indexOf(query) > -1) {
          results.push(res[i])
        }
      }
      data.results = results
      io.emit('updateSearchResults', data)
    })
  },

  loadDepartments: function(db, io, debugOn) {

    if (debugOn) { console.log('loadDepartments') }

    _loadDepartments(db, io)
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
            _loadWhosAnswered(db, io, query)
          })
        })
      }
    })
  },

  prevQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('prevQuestion', data) }

    data.order = data.question.order - 1
    io.emit('setQuestion', data)
  },

  nextQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('nextQuestion', data) }

    data.order = data.question.order + 1
    io.emit('setQuestion', data)
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
      db.assessmentsCollection.updateOne({'_id': res._id}, {$set: {questions: questions}}, function(err, ) {
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
          const questions = res[0].questions
          switch (data.scope.format) {
            case 'table':
              results = resultsFuns.getTabular(res, server, teams, data.scope, data.appType)
              if (data.scope.export) {
                io.emit('loadExportResults', {results: results, questions: questions})
              } else {
                io.emit('loadTabularResults', {results: results, questions: questions})
              }
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
              const answerBy = team ? team.members.find((m) => {
                return m.id == res[i].member.id
              }).name : null
              answers.push({
                answer: res[i].questions[j].answer,
                by: answerBy
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

  addDepartment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addDepartment', data) }

    const team = newDepartment(data)
    db.departmentsCollection.insertOne(team, function(err, res) {
      if (err) throw err
      _loadDepartments(db, io)
    })
  },

  updateDepartmentName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateDepartmentName', data) }

    db.departmentsCollection.updateOne({id: data.id}, {$set: {name: data.name}}, function(err, res) {
      if (err) throw err
      _loadDepartments(db, io)
    })
  },

  deleteDepartment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteDepartment', data) }

    db.departmentsCollection.deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      _loadDepartments(db, io)
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

  updateTeamDepartment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamDepartment', data) }

    db.teamsCollection.updateOne({id: data.id}, {$set: {department: {id: data.department}}}, function(err, res) {
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
    if (data.departmentId) {
      db.departmentsCollection.findOne({id: data.departmentId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = res.members ? res.members : []
          members.push(member)
          db.departmentsCollection.updateOne({id: data.departmentId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadDepartments(db, io)
          })
        }
      })
    } else {
      db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = res.members ? res.members : []
          members.push(member)
          db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadTeams(db, io)
          })
        }
      })
    }
  },

  updateMemberDetails: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateMemberDetails', data) }

    if (data.departmentId) {
      db.departmentsCollection.findOne({id: data.departmentId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = []
          for (let i = 0; i < res.members.length; i++) {
            const member = res.members[i]
            if (member.id == data.id) {
              member.name = data.name
              member.email = data.email
            }
            members.push(res.members[i])
          }
          db.departmentsCollection.updateOne({id: data.departmentId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadDepartments(db, io)
          })
        }
      })
    } else {
      db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = []
          for (let i = 0; i < res.members.length; i++) {
            const member = res.members[i]
            if (member.id == data.id) {
              member.name = data.name
              member.email = data.email
            }
            members.push(res.members[i])
          }
          db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadTeams(db, io)
          })
        }
      })
    }
  },

  makeMainContact: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeMainContact', data) }

    if (data.departmentId) {
      db.departmentsCollection.findOne({id: data.departmentId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = []
          for (let i = 0; i < res.members.length; i++) {
            const member = res.members[i]
            member.mainContact = member.id == data.id
            members.push(res.members[i])
          }
          db.departmentsCollection.updateOne({id: data.departmentId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadDepartments(db, io)
          })
        }
      })
    } else {
      db.teamsCollection.findOne({id: data.teamId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = []
          for (let i = 0; i < res.members.length; i++) {
            const member = res.members[i]
            member.mainContact = member.id == data.id
            members.push(res.members[i])
          }
          db.teamsCollection.updateOne({id: data.teamId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadTeams(db, io)
          })
        }
      })
    }
  },

  deleteMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteMember', data) }

    if (data.departmentId) {
      db.departmentsCollection.findOne({id: data.departmentId}, function(err, res) {
        if (err) throw err
        if (res) {
          const members = []
          for (let i = 0; i < res.members.length; i++) {
            if (res.members[i].id != data.id) {
              members.push(res.members[i])
            }
          }
          db.departmentsCollection.updateOne({id: data.departmentId}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadDepartments(db, io)
          })
        }
      })
    } else {
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
    }
  },

  changeTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('changeTeam', data) }

    db.teamsCollection.find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          let members = res[i].members
          if (res[i].id == data.teamId) {
            members.push(data.member)
          } else {
            const newMembers = []
            for (let j = 0; j < members.length; j++) {
              if (members[j].id != data.member.id) {
                newMembers.push(members[j])
              }
            }
            members = newMembers
          }
          db.teamsCollection.updateOne({'_id': res[i]._id}, {$set: {members: members}}, function(err, res) {
            if (err) throw err
            _loadTeams(db, io)
          })
        }
      }
    })
    db.assessmentsCollection.find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].member.id == data.member.id) {
            const team = res[i].team
            team.id = data.teamId
            db.assessmentsCollection.updateOne({'_id': res[i]._id}, {$set: {team: team}}, function(err, res) {
              if (err) throw err
            })
          }
        }
      }
    })
  },

  deleteAssessment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteAssessment', data) }

    const parts = data.label.split(/\-/)
    const year = parts[0]
    const monthOrQuarter = parts[1].replace(/^Q/, '')
    db.assessmentsCollection.find({'team.id': data.teamId}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          const assessment = res[i]
          if (assessment.member.id == data.memberId && year == assessment.year) {
            if (assessment.quarter == monthOrQuarter || assessment.month == parseInt(monthOrQuarter)) {
              db.assessmentsCollection.deleteOne({"_id": assessment._id}, function(err, ) {
                if (err) throw err
                data.id = data.teamId
                _assessmentsDone(db, io, data, debugOn)
              })
            }
          }
        }
      }
    })
  },

  allAssessmentsDone: function(db, io, data, debugOn) {

    if (debugOn) { console.log('allAssessmentsDone', data) }

    _allAssessmentsDone(db, io, data, debugOn)
  },

  assessmentsDone: function(db, io, data, debugOn) {

    if (debugOn) { console.log('assessmentsDone', data) }

    _assessmentsDone(db, io, data, debugOn)
  },

  addQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addQuestion', data) }

    db.serverCollection.findOne({}, function(err, server) {
      if (err) throw err
      db.questionCollection.find().toArray(function(err, res) {
        if (err) throw err
        if (res.length) {
          data.order = res.length + 1
          const question = newQuestion(data, server.comments)
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

  updateQuestionLevel: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateQuestionLevel', data) }

    db.questionCollection.findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        const question = res.question
        question.levels[data.level].description = data.value
        db.questionCollection.updateOne({id: data.id}, {$set: {question: question}}, function(err, res) {
          if (err) throw err
          _loadQuestions(db, io)
        })
      }
    })
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
