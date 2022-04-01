
import params from './params.js'

const AppType = {

  get: function(appType) {
    if (process.env.VUE_APP_TYPE) {
      appType = process.env.VUE_APP_TYPE
    } else if (params.getParam('appType')) {
      // To allow appType switching in dev
      appType = params.getParam('appType')
    }
    return appType
  },

  scope: function(scope) {
    if (process.env.VUE_APP_SCOPE) {
      scope = process.env.VUE_APP_SCOPE
    } else if (params.getParam('scope')) {
      // To allow scope switching in dev
      scope = params.getParam('scope')
    }
    return scope
  },

}

export default AppType
