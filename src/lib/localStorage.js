
import { v4 as uuidv4 } from 'uuid'

const LocalStorage = {

  check: function() {
    let check
    const uuid = uuidv4()
    try {
      localStorage.setItem('agile-simulations-test', uuid)
      if (localStorage.getItem('agile-simulations-test') == uuid) {
        check = 'ok'
      }
      localStorage.removeItem('agile-simulations-test')
    }
    catch(e) {
      check = e
    }
    return check
  },

  clear: function(suffix) {
    const expr = new RegExp('-' + suffix + '$')
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).match(expr)) {
        console.log('deleting', localStorage.key(i))
        localStorage.removeItem(localStorage.key(i))
      }
    }
  },

  storeAssessment: function(assessment, suffix) {
    localStorage.setItem('assessment-' + suffix, JSON.stringify(assessment))
  },

  getAssessment: function(suffix) {
    const assessment = localStorage.getItem('assessment-' + suffix)
    return assessment ? JSON.parse(assessment) : null
  }


}

export default LocalStorage
