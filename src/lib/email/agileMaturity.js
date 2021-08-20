
import email from './email.js'

const intro =
  'Thanks for using the free version of the Agile Maturity app\n\n' +
  'It is always a good idea to see how tour teams are performing, and this app allows you to do just that.\n\n' +
  'To run this with your whole team, or across teams, you will need to purchase a (very reasonable) subscription to our service. This will give you access to all aggregation, trending and results functionality to get the most from this app.\n\n'

function formatResults(results) {
  let str = ''
  const keys =  Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const resKey = Object.keys(results[key].results).reverse()[0]
    const result = results[key].results[resKey]
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

  emailContent: function(name, organisation, results) {
    let str = 'Team Health Check'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }
    str = str + '\n\n'
    str = str + intro
    str = str + '\n\n'
    str = str + formatResults(results)
    str = str + '\n\n'
    str = str + email.pricing()

    return str
  }

}

export default AgileMaturity
