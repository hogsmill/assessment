
import { v4 as uuidv4 } from 'uuid'

const Session = {

  create: function(store, bus, server, suffix, team, month, quarter, year, name, organisation, email) {
    let assessmentId = localStorage.getItem('assessment-' + suffix)
    if (!assessmentId) {
      assessmentId = uuidv4()
      localStorage.setItem('assessment-' + suffix, assessmentId)
    }
    store.dispatch('updateAssessmentId', assessmentId)
    const assessment = {
      id: assessmentId,
      team: team,
      month: month,
      quarter: quarter,
      year: year,
      name: name,
      organisation: organisation,
      email: email
    }
    bus.$emit('sendCreateAssessment', assessment)
  },

  store: function(store, bus, suffix) {
    const assessmentId = localStorage.getItem('assessment-' + suffix)
    if (assessmentId) {
      store.dispatch('updateAssessmentId', assessmentId)
      bus.$emit('sendLoadAssessment', {id: assessmentId})
    }
  },

  clear: function(store, suffix) {
    localStorage.removeItem('assessment-' + suffix)
    store.dispatch('updateAssessmentId', null)
    store.dispatch('updateAssessment', null)
  }

}

export default Session
