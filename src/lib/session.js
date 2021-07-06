
import { v4 as uuidv4 } from 'uuid'

const Session = {

  create: function(store, bus, suffix, team, month, quarter, year) {
    let assessment = localStorage.getItem('assessment-' + suffix)
    if (!assessment) {
      assessment = uuidv4()
      localStorage.setItem('assessment-' + suffix, assessment)
    }
    store.dispatch('updateAssessment', assessment)
    bus.$emit('sendCreateAssessment', {
      assessment: assessment,
      team: team,
      month: month,
      quarter: quarter,
      year: year
    })
  },

  store: function(store, suffix) {
    const assessment = localStorage.getItem('assessment-' + suffix)
    if (assessment) {
      store.dispatch('updateAssessment', assessment)
    }
  },

  clear: function(store, suffix) {
    localStorage.removeItem('assessment-' + suffix)
    store.dispatch('updateAssessment', null)
  }

}

export default Session
