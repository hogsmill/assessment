
function resultValue(n) {
  let val = ''
  switch(n) {
    case 0:
      val = 'RED'
      break
    case 1:
      val = 'AMBER'
      break
    case 2:
      val = 'GREEN'
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
    const result = results[key].results[resKey]
    str = str + results[key].question + ': ' + resultValue(result) + '\n\n'
  }
  return str
}

const TeamHealthCheck = {

  emailTitle: function(name, organisation) {
    let str = 'Team Health Check'
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
    str = str + formatResults(results)
    str = str + '\n\n'

    return str
  }

}

export default TeamHealthCheck
