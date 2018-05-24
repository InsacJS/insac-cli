module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const { SendGridMailModule } = require('insac')

module.exports = (app) => {
  const CONFIG = app.config.${MODULE}

  return new SendGridMailModule(CONFIG)
}
`
  return _r
}
