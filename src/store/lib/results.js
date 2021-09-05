
const generic = require('./generic.js')
const fiveDysfunctions = require('./fiveDysfunctions.js')
const teamHealthCheck = require('./teamHealthCheck.js')
const agileMaturity = require('./agileMaturity.js')

function assessmentBy(assessment, teams) {
  console.log(assessment, assessment.team, assessment.member)
  let by = null
  if (assessment.team) {
    const team = teams.find((t) => {
      return t.id == assessment.team
    })
    console.log('here', team)
    if (team && assessment.member) {
      by = team.members.find((m) => {
        return m.id == assessment.member
      }).name
    }
    console.log('here 2', by)
  }
  return by
}

function setResults(assessments, appType) {
  let results
  switch(appType) {
    case '5 Dysfunctions':
      results = fiveDysfunctions.setResults(assessments)
      break
    default:
      results = generic.setResults(assessments)
      break
  }
  return results
}

function getKey(assessment, server) {
  let key
  if (server.scope == 'individual') {
    const date = new Date()
    let month = parseInt(date.getMonth() + 1)
    month = month < 10 ? '0' + month : month
    key = date.getFullYear() + '-' + month
  } else {
    if (assessment.quarter) {
      key = assessment.year + '-' + assessment.quarter
    } else if (assessment.month){
      let month = assessment.month
      month = month < 10 ? '0' + month : month
      key = assessment.year + '-' + month
    } else {
      key = '9999-99'
    }
    key = 'm' + assessment.member.id + '+t' + assessment.team.id + '+' + key
  }
  return key
}

function result(results, question, key) {
  if (!results.results) {
    results.results = {}
  }
  results.results[key] = question.answer
  return results
}

function average(results) {
  let n = 0
  const comments = []
  for (let i = 0; i < results.length; i++) {
    n = n + results[i].answer
    if (results[i].comments) {
      const resultComments = results[i].comments
      for (let j = 0; j < resultComments.length; j++) {
        comments.push(resultComments[j])
      }
    }
  }
  result = {
    answer: n / results.length,
    comments: comments
  }
  return result
}

function aggregateAnswers(results, scope, appType) {
  const aggregated = {}
  let keys = Object.keys(results)
  for (var i = 0; i < keys.length; i++) {
    if (scope.member == 'individual') {
      const newKey = keys[i]
      aggregated[newKey] = []
      aggregated[newKey].push(results[keys[i]])
    } else if (scope.member == 'team') {
      const newKey = keys[i].split('+')[1] + '-' + keys[i].split('+')[2]
      if (!aggregated[newKey]) {
        aggregated[newKey] = []
      }
      aggregated[newKey].push(results[keys[i]])
    } else if (scope.member == 'organisation') {
      const newKey = keys[i].split('+')[2]
      if (!aggregated[newKey]) {
        aggregated[newKey] = []
      }
      aggregated[newKey].push(results[keys[i]])
    }
  }
  keys = Object.keys(aggregated)
  const summarised = {}
  for (var i = 0; i < keys.length; i++) {
    const newKey = keys[i].match(/\d{4}\-\d{2}$/)[0]
    summarised[newKey] = average(aggregated[keys[i]])
  }
  return summarised
}

function aggregate(results, scope, appType) {
  const keys = Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    results[keys[i]].results = aggregateAnswers(results[keys[i]].results, scope, appType)
  }
  return results
}

module.exports = {

  scope: function(scope) {
    return scope.format == 'table' ? 'table' : 'graph'
  },

  getTabular: function(assessments, server, teams, scope, appType) {
    let results = setResults(assessments, appType)
    for (let i = 0; i < assessments.length; i++) {
      const key = getKey(assessments[i], server)
      const by = assessmentBy(assessments[i], teams)
      switch(appType) {
        case '5 Dysfunctions':
          results = fiveDysfunctions.assessmentResults(assessments[i], key, results, by)
          break
        default:
          results = generic.assessmentResults(assessments[i], key, results, by)
          break
      }
    }
    if (scope) {
      results = aggregate(results, scope, appType)
    }
    return results
  },

  getGraph: function(assessments, server, teams, scope, appType) {
    let results = {}
    switch(scope.date) {
      case 'single':
        results = generic.graphSingleDatasets(assessments, scope, teams)
        break
      case 'all':
        results = generic.graphAllDatasets(assessments, server)
        break
    }
    return results
  }

}
