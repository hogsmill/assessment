
import config from './config.js'

const conf = config.config()

const _datasets = [
  [100, 150, 250, 400],
  [400, 150, 100, 200]
]

// Single: x = question, y = anwer, line = team or individ

function questionLabels(results) {
  const keys = Object.keys(results)
  const labels = []
  for (let i = 0; i < keys.length; i++) {
    labels.push(results[keys[i]].question)
  }
  return labels
}

function singleData(results) {
  const datasets = conf.data.datasets
  datasets[0] = config.dataset('red')
  datasets[0].data = _datasets[0]
  return datasets
}

// All: x = date, y = anwer, line = a question

function dateLabels(results) {
  const keys = Object.keys(results)
  const labels = []
  for (let i = 0; i < keys.length; i++) {
    const result = results[keys[i]]
    const resultKeys = Object.keys(result.results)
    for (let j = 0; j < resultKeys.length; j++) {
      if (labels.indexOf(resultKeys[j]) == -1) {
        labels.push(resultKeys[j])
      }
    }
  }
  return labels.sort()
}

function allData(results) {
  const datasets = conf.data.datasets
  datasets[0] = config.dataset('blue')
  datasets[0].data = _datasets[1]
  return datasets
}

const Line = {

  data: function(results, scope) {
    switch(scope.date) {
      case 'single':
        conf.data.labels = questionLabels(results)
        conf.data.datasets = singleData(results)
        break
      case 'all':
        conf.data.labels = dateLabels(results)
        conf.data.datasets = allData(results)
        break
    }
    return conf.data
  },

  options: function() {
    return config.config().options
  }

}

export default Line
