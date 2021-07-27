
/* Potential assessment keys:

Organisation
  team
  month
  quarter
  year
  member
  organisation

Individual
  name
  organisaton
  email
*/

const fiveDysfunctionsFuns = require('./fiveDysfunctions.js')
const teamHealthCheckFuns = require('./teamHealthCheck.js')

function setResults(assessments) {
  const results = {}
  for (let i = 0; i < assessments.length; i++) {
    const assessment = assessments[i]
    for (let j = 0; j < assessment.questions.length; j++) {
      const question = assessment.questions[j]
      results[question.id] = {
        question: question.question.title,
        results: {}
      }
    }
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

function average(summarised, appType) {
  switch(appType) {
    case 'Team Health Check':
      summarised = teamHealthCheckFuns.summarise(summarised)
      break
    case '5 Dysfunctions':
      summarised = fiveDysfunctionsFuns.summarise(summarised)
      break
  }
  return summarised
}

function summariseAnswers(results, scope, appType) {
  const aggregated = {}
  let keys = Object.keys(results)
  for (var i = 0; i < keys.length; i++) {
    const newKey = keys[i].split('+')[2]
    if (scope.member == 'individual') {
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
    summarised[newKey] = average(aggregated[keys[i]], appType)
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
    let results = setResults(assessments)
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i]
      for (let j = 0; j < assessment.questions.length; j++) {
        const question = assessment.questions[j]
        const key = getKey(assessment, server)
        results[question.id] = result(results[question.id], question, key)
      }
    }
    results = summarise(results, scope, appType)
    console.log('results', results)
    return results
  }

}
