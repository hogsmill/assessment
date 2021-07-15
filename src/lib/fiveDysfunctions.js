
function formatResults(results) {
  let str = ''
  const keys =  Object.keys(results)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    str = str + key + ': ' + results[key] + ' / 9\n'
    if (results[key] >= 8) {
      str = str + '  - Everything is fine for this dysfunction\n\n'
    } else if (results[key] >= 5) {
      str = str + '  - This dysfunction could be worrying - it is worth keeping an eye on this\n\n'
    } else {
      str = str + '  - This dysfunciton needs addressing\n\n'
    }
  }
  return str
}

const FiveDysfunctions = {

  emailTitle: function(name, organisation) {
    let str = '5 Dysfunction Results'
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
    str = str + formatResults(results)

    return str
  }
}

export default FiveDysfunctions
