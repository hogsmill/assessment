
function formatLabel(n) {
  return n < 10 ? '0' + n : n
}

function matchKey(key, assessment) {
  return key == assessment.member.id || key == assessment.team.id
}

function matchPeriod(key, assessment) {
  return
    key == assessment.year + '-q' + formatLabel(assessment.quarter) ||
    key == assessment.year + '-' + formatLabel(assessment.month)
}

function average(array) {
  let sum = 0
  for (let i = 0; i < array.length; i++) {
    if (typeof(array[i]) == 'number') {
      sum = sum + array[i]
    }
  }
  return array.length == 0 ? 0 : sum / array.length
}

function aggregateData(array) {
  const data = []
  for (let i = 0; i < array.length; i++) {
    data.push(average(array[i]))
  }
  return data
}

function aggregate(datasets) {
  const data = []
  const keys = Object.keys(datasets)
  for (let i = 0; i < keys.length; i++) {
    data[i] = {
      label: datasets[keys[i]].label,
      data: aggregateData(datasets[keys[i]].data)
    }
  }
  return data
}

function initGraphSingleDatasets(assessment, scope, teams) {
  const data = {}
  switch(scope.member) {
    case 'team':
      const members = teams.find((t) => {
        return t.id == assessment.team.id
      }).members
      for (let i = 0; i < members.length; i++) {
        const dataArrays = []
        for (let q = 0; q < assessment.questions.length; q++) {
          dataArrays.push([])
        }
        data[members[i].id] = {
          label: members[i].name,
          data: dataArrays
        }
      }
      break
    case 'organisation':
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].name != '_No Team_') {
          const dataArrays = []
          for (let q = 0; q < assessment.questions.length; q++) {
            dataArrays.push([])
          }
          data[teams[i].id] = {
            label: teams[i].name,
            data: dataArrays
          }
        }
      }
      break
  }
  return data
}

function initGraphAllDatasets(assessments, server) {
  const periods = Object.keys(periodLabels(assessments, server))
  let data = {}
  const questions = assessments[0].questions.sort((a, b) => {
    return a.order - b.order
  })
  for (let q = 0; q < questions.length; q++) {
    const dataArrays = []
    for (let j = 0; j < periods.length; j++) {
      dataArrays.push([])
    }
    data[questions[q].id] = {
      label: questions[q].question.title,
      data: dataArrays
    }
  }
  return data
}

function questionLabels(assessment) {
  questions = assessment.questions.sort((a, b) => {
    return a.order - b.order
  })
  const labels = []
  for (let i = 0; i < questions.length; i++) {
    labels.push(questions[i].question.title)
  }
  return labels
}

function periodLabels(assessments, server) {
  let periods = {}
  for (let i = 0; i < assessments.length; i++) {
    switch(server.frequency) {
      case 'monthly':
        periods[assessments[i].year + '-' + formatLabel(assessments[i].month)] = true
        break
      case 'quarterly':
        periods[assessments[i].year + '-q' + formatLabel(assessments[i].quarter)] = true
        break
    }
  }
  return periods
}

function labelIndex(assessment, labels, server) {
  let label
  switch(server.frequency) {
    case 'monthly':
      label = assessment.year + '-' + formatLabel(assessment.month)
      break
    case 'quarterly':
      label = assessment.year + '-q' + formatLabel(assessment.quarter)
      break
  }
  return labels.indexOf(label)
}

module.exports = {

  // Tabular

  setResults: function(assessments, appType) {
    const results = {}
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i]
      for (let j = 0; j < assessment.questions.length; j++) {
        const question = assessment.questions[j]
        if (!results[question.id]) {
          results[question.id] = {
            question: question.question.title,
            results: {}
          }
        }
      }
    }
    return results
  },

  assessmentResults: function(assessment, key, results, by) {
    for (let i = 0; i < assessment.questions.length; i++) {
      question = assessment.questions[i]
      results[question.id].results[key] = {answer: question.answer}
      const comments = results[question.id].results[key].comments ? results[question.id].results[key].comments : []
      for (let k = 0; k < question.comments.length; k++) {
        comments.push({
          comment: question.comments[k],
          by: by
        })
      }
      results[question.id].results[key].comments = comments
    }
    return results
  },

  // Graph

  graphSingleDatasets: function(assessments, scope, teams) {
    let i, j, k
    const datasets = initGraphSingleDatasets(assessments[0], scope, teams)
    const keys = Object.keys(datasets)
    let questions
    for (i = 0; i < assessments.length; i++) {
      questions = assessments[i].questions.sort((a, b) => {
        return a.order - b.order
      })
      for (j = 0; j < keys.length; j++) {
        if (matchKey(keys[j], assessments[i])) {
          for (k = 0; k < questions.length; k++) {
            const answer = typeof(questions[k].answer) == 'number' ? questions[k].answer : 0
            datasets[keys[j]].data[k].push(answer)
          }
        }
      }
    }
    return {
      labels: questionLabels(assessments[0]),
      datasets: aggregate(datasets)
    }
  },

  graphAllDatasets: function(assessments, server) {
    const datasets = initGraphAllDatasets(assessments, server)
    const keys = Object.keys(datasets)
    const labels = Object.keys(periodLabels(assessments, server))
    let questions
    for (i = 0; i < assessments.length; i++) {
      questions = assessments[i].questions.sort((a, b) => {
        return a.order - b.order
      })
      for (j = 0; j < keys.length; j++) {
        for (k = 0; k < questions.length; k++) {
          if (questions[k].id == keys[j]) {
            const index = labelIndex(assessments[i], labels, server)
            const answer = typeof(questions[k].answer) == 'number' ? questions[k].answer : 0
            datasets[keys[j]].data[index].push(answer)
          }
        }
      }
    }
    return {
      labels: Object.keys(periodLabels(assessments, server)),
      datasets: aggregate(datasets)
    }
    return datasets
  }

}
