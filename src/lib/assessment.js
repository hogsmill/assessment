
const assessmentKeys = [
  'assessmentId',
  'team',
  'member',
  'month',
  'quarter',
  'year',
  'member',
  'name',
  'organisation'
]

const Assessment = {

  isThisAssessment: function(data, assessment) {
    let matches = true
    for (let i = 0; i < assessmentKeys.length; i++) {
      const key = assessmentKeys[i]
      if (data[key] != assessment[key]) {
        matches = false
      }
    }
    return matches
  }

}

export default Assessment
