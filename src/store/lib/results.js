
const fiveDysfunctionsFuns = require('./fiveDysfunctions.js')
const teamHealthCheckFuns = require('./teamHealthCheck.js')

function setResults(assessments, appType) {
  let results
  switch(appType) {
    case 'Team Health Check':
      results = teamHealthCheckFuns.setResults(assessments)
      break
    case '5 Dysfunctions':
      results = fiveDysfunctionsFuns.setResults(assessments)
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
    } else {
      let month = assessment.month
      month = month < 10 ? '0' + month : month
      key = assessment.year + '-' + month
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
  for (let i = 0; i < results.length; i++) {
    n = n + results[i]
  }
  return n / results.length
}

function summariseAnswers(results, scope, appType) {
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

function summarise(results, scope, appType) {
  const keys = Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    results[keys[i]].results = summariseAnswers(results[keys[i]].results, scope, appType)
  }
  return results
}

module.exports = {

  get: function(assessments, server, scope, appType) {
    let results = setResults(assessments, appType)
    for (let i = 0; i < assessments.length; i++) {
      const key = getKey(assessments[i], server)
      switch(appType) {
        case 'Team Health Check':
          results = teamHealthCheckFuns.assessmentResults(assessments[i], key, results)
          break
        case '5 Dysfunctions':
          results = fiveDysfunctionsFuns.assessmentResults(assessments[i], key, results)
          break
      }
    }
    results = summarise(results, scope, appType)
    return results
  }

}
