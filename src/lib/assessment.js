
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

  isThisAssessment: function(data, assessment, ignoreMember) {
    let matches = true
    for (let i = 0; i < assessmentKeys.length; i++) {
      const key = assessmentKeys[i]
      if (!ignoreMember || key != 'member') {
        if (ids[key] && data[key]) {
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
