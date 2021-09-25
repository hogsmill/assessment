
import email from './email.js'

const intro =
  'Thanks for using the free version of the Agile Maturity app\n\n' +
  'It is always a good idea to see how tour teams are performing, and this app allows you to do just that.\n\n' +
  'To run this with your whole team, or across teams, you will need to purchase a (very reasonable) subscription to our service. This will give you access to all aggregation, trending and results functionality to get the most from this app.\n\n'

function questionArea(id, questions) {
  const question = questions.find((q) => {
    return q.id == id
  })
  return question ? question.question.area : ''
}

function sortedKeys(questions) {
   questions = questions.sort((a, b) => {
    return a.order - b.order
  })
  const keys = []
  for (let i = 0; i < questions.length; i++) {
    keys.push(questions[i].id)
  }
  return keys
}

function formatResults(results, questions) {
  let str = ''
  let area = ''
  const keys =  sortedKeys(questions)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const qArea = questionArea(key, questions)
    const resKey = Object.keys(results[key].results).reverse()[0]
    const result = results[key].results[resKey].answer
    if (qArea != area) {
      str = str + qArea.toUpperCase() + '\n\n'
      area = qArea
    }
    str = str + results[key].question + ': ' + result + ' / 5\n\n'
  }
  return str
}

const AgileMaturity = {

  emailTitle: function(name, organisation) {
    let str = 'Agile Maturity Assessment'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }

    return str
  },

  emailContent: function(name, organisation, results, questions) {
    let str = 'Agile Maturity Assessment'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }
    str = str + '\n\n'
    str = str + intro
    str = str + '\n\n'
    str = str + formatResults(results, questions)
    str = str + '\n\n'
    str = str + email.pricing()

    return str
  }

}

export default AgileMaturity
