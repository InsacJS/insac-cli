module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const { ResourceModule } = require('insac')

module.exports = (app) => {
  const CONFIG = app.config.${MODULE}

  return new ResourceModule(CONFIG)
}
`
  return _r
}
