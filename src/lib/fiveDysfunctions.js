
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

  emailContent: function(name, organisation, assessment) {
    let str = '5 Dysfunction Results'
    if (name) {
      str = str + ' for ' + name
    }
    if (organisation) {
      str = str + ' of ' + organisation
    }
    str = str + '\n\n'
    str = str + 'RESULTS HERE'

    console.log(assessment)
    return str
  }
}

export default FiveDysfunctions
