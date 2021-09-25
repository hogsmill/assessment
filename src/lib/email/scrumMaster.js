
import email from './email.js'

const intro =
  'Thanks for using the free version of the Scrum Master Assessment app\n\n' +
  'It is always a good idea to regularly check the heath of teams, and this app allows you to do just that.\n\n' +
  'To run this with your whole team, or across teams, you will need to purchase a (very reasonable) subscription to our service. This will give you access to all aggregation, trending and results functionality to get the most from this app.\n\n'

function resultValue(n) {
  let val = 0
  switch(n) {
    case 0:
      val = 'Tourist (Still do not know how to apply this or never heard of this)'
      break
    case 1:
      val = 'Starting (This is on my radar)'
      break
    case 2:
      val = 'Improving (On-progress but still needs much more of my attention)'
      break
    case 3:
      val = 'Steady (It is there but needs action to take it to the next level)'
      break
    case 4:
      val = 'Expert (This is on the right track. Just keep going)'
      break
    case 5:
      val = 'Master (Full maturity here, I don’t need to worry about it)'
      break
  }
  return val
}

function formatResults(results) {
  let str = ''
  const keys =  Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const resKey = Object.keys(results[key].results).reverse()[0]
    const result = results[key].results[resKey].answer
    str = str + results[key].question + ': ' + resultValue(result) + '\n\n'
  }
  return str
}

const ScrumMaster = {

  emailTitle: function(name, organisation) {
    let str = 'Scrum Master Assessment'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }

    return str
  },

  emailContent: function(name, organisation, results) {
    let str = 'Scrum Master Assessment'
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

export default ScrumMaster
