const { ResourceModule } = require('insac')

module.exports = (app) => {
  const OPTIONS = {}

  OPTIONS.moduleName = 'API'

  return new ResourceModule(app, OPTIONS)
}
