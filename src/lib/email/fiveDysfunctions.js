
import email from './email.js'

const explanationText =
  '<h3>Members of a team with an absence of trust...</h3>\n' +
  '  <ul>' +
  '    <li>Conceal their weaknesses and mistakes from one another</li>\n' +
  '    <li>Hesitate to ask for help or provide constructive feedback</li>\n' +
  '    <li>Hesitate to offer help outside their own areas of responsibility</li>\n' +
  '    <li>Jump to conclusions about the intentions and aptitudes of others without attempting to clarify them</li>\n' +
  '    <li>Fail to recognize and tap into one another’s skills and experiences</li>\n' +
  '    <li>Waste time and energy managing their behaviours for effect</li>\n' +
  '    <li>Hold grudges</li>\n' +
  '    <li>Dread meetings and find reasons to avoid spending time together</li>\n\n' +
  '  </ul>\n\n' +
  '<h3>Teams that fears conflict...</h3>\n' +
  '  <ul>' +
  '    <li>Have boring meetings</li>\n' +
  '    <li>Create environments where back-channel politics and personal attacks thrive</li>\n' +
  '    <li>Ignore controversial topics that are critical to team success</li>\n' +
  '    <li>Fail to tap into all the opinions and perspectives of team members</li>\n\n' +
  '  </ul>\n\n' +
  '<h3>A team that fails to commit...</h3>\n' +
  '  <ul>' +
  '    <li>Creates ambiguity among the team about direction and priorities</li>\n' +
  '    <li>Watches windows of opportunity close due to excessive analysis and unnecessary delay</li>\n' +
  '    <li>Breeds lack of confidence and fear of failure</li>\n' +
  '    <li>Revisits discussions and decisions again and again</li>\n' +
  '    <li>Encourages second-guessing among team members</li>\n\n' +
  '  </ul>\n\n' +
  '<h3>A team that avoids accountability...</h3>\n' +
  '  <ul>' +
  '    <li>Creates resentment among team members who have different standards of performance</li>\n' +
  '    <li>Encourages mediocrity</li>\n' +
  '    <li>Misses deadlines and key deliverables</li>\n\n' +
  '  </ul>\n\n' +
  '<h3>A team that is not focused on results...</h3>\n' +
  '  <ul>' +
  '    <li>Stagnates/fails to grow</li>\n' +
  '    <li>Rarely defeats competitors</li>\n' +
  '    <li>Loses achievement-oriented employees</li>\n' +
  '    <li>Encourages team members to focus on their own careers and individual goals</li>\n\n' +
  '  </ul>\n\n'

const intro =
  'Thanks for using the free version of the 5 Dysfunctions of Teams app\n\n' +
  'To run this with your whole team, or across teams, you will need to purchase a (very reasonable) subscription to our service. This will give you access to all aggregation, trending and results functionality to get the most from this app.\n\n'

function formatResults(results) {
  let str = ''
  const keys =  Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const resKey = Object.keys(results[key].results).reverse()[0]
    const result = results[key].results[resKey]
    str = str + results[key].question + ': ' + result + ' / 9 '
    if (result >= 8) {
      str = str + ' - Everything is fine for this dysfunction\n\n'
    } else if (result >= 5) {
      str = str + ' - This dysfunction could be worrying; it is worth keeping an eye on this\n\n'
    } else {
      str = str + ' - This dysfunction needs addressing\n\n'
    }
  }
  return str
}

function cleanForEmail(str) {
  str = str.replace(/<h3>/g, '')
  str = str.replace(/<\/h3>/g, '')
  str = str.replace(/<ul>/g, '')
  str = str.replace(/<\/ul>/g, '')
  str = str.replace(/<li>/g, '  - ')
  str = str.replace(/\/li>/g, '')

  return str
}

const FiveDysfunctions = {

  emailTitle: function(name, organisation) {
    let str = '5 Dysfunctions of a Team Results'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }

    return str
  },

  emailContent: function(name, organisation, results) {
    let str = '5 Dysfunction Results'
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
    str = str + cleanForEmail(explanationText)
    str = str + '\n\n'
    str = str + email.pricing()

    return str
  },

  explanation: function() {
    return explanationText
  }

}

export default FiveDysfunctions
