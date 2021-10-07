
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

const ids = {
  team: true,
  member: true
}

const Assessment = {

  isThisAssessment: function(data, assessment, ignore) {
    let matches = true
    for (let i = 0; i < assessmentKeys.length; i++) {
      const key = assessmentKeys[i]
      if (!ignore || !ignore[key]) {
        if (ids[key]) {
          if (data[key].id != assessment[key].id) {
            matches = false
          }
        } else {
          if (data[key] != assessment[key]) {
            matches = false
          }
        }
      }
    }
    return matches
  }

}

export default Assessment
