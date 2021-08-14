
import email from './email.js'

const explanationText =
  '<h3>Members of a team with an absence of trust...\n' +
  '  - Conceal their weaknesses and mistakes from one another\n' +
  '  - Hesitate to ask for help or provide constructive feedback\n' +
  '  - Hesitate to offer help outside their own areas of responsibility\n' +
  '  - Jump to conclusions about the intentions and aptitudes of others without attempting to clarify them\n' +
  '  - Fail to recognize and tap into one another’s skills and experiences\n' +
  '  - Waste time and energy managing their behaviours for effect\n' +
  '  - Hold grudges\n' +
  '  - Dread meetings and find reasons to avoid spending time together\n\n' +
  '<h3>Teams that fears conflict...</h3>\n' +
  '  - Have boring meetings\n' +
  '  - Create environments where back-channel politics and personal attacks thrive\n' +
  '  - Ignore controversial topics that are critical to team success\n' +
  '  - Fail to tap into all the opinions and perspectives of team members\n\n' +

  '<h3>A team that fails to commit...</h3>\n' +
  '  - Creates ambiguity among the team about direction and priorities\n' +
  '  - Watches windows of opportunity close due to excessive analysis and unnecessary delay\n' +
  '  - Breeds lack of confidence and fear of failure\n' +
  '  - Revisits discussions and decisions again and again\n' +
  '  - Encourages second-guessing among team members\n\n' +

  '<h3>A team that avoids accountability...</h3>\n' +
  '  - Creates resentment among team members who have different standards of performance\n' +
  '  - Encourages mediocrity\n' +
  '  - Misses deadlines and key deliverables\n\n' +

  '<h3>A team that is not focused on results...</h3>\n' +
  '  - Stagnates/fails to grow\n' +
  '  - Rarely defeats competitors\n' +
  '  - Loses achievement-oriented employees\n' +
  '  - Encourages team members to focus on their own careers and individual goals\n\n'

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
    str = str + explanationText.replace(/<h3>/g, '').replace(/<\/h3>/g, '')
    str = str + '\n\n'
    str = str + email.pricing()

    return str
  },

  explanation: function() {
    return explanationText
  }

}

export default FiveDysfunctions
