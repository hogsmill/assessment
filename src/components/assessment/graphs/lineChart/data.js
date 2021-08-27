
import config from './config.js'

const conf = config.config()

const _datasets = [
  [100, 150, 250, 400],
  [400, 150, 100, 200]
]

function single(results) {
  // x = question, y = anwer, line = team or individ
  const datasets = conf.data.datasets
  datasets[0] = config.dataset('red')
  datasets[0].data = _datasets[0]
  return datasets
}

function all(results) {
  // x = date, y = anwer, line = a question
  const datasets = conf.data.datasets
  datasets[0] = config.dataset('blue')
  datasets[0].data = _datasets[1]
  return datasets
}

const Line = {

  data: function(results, scope) {
    const keys = Object.keys(results)
    const labels = []
    for (let i = 0; i < keys.length; i++) {
      labels.push(results[keys[i]].question)
    }
    switch(scope.date) {
      case 'single':
        conf.data.datasets = single(results)
        break
      case 'all':
        conf.data.datasets = all(results)
        break
    }
    conf.data.labels = labels
    return conf.data
  },

  options: function() {
    return config.config().options
  }

}

export default Line
