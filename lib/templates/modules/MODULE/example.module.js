module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const Module = require(insac).Module

module.exports = (app) => {
  const CONFIG = app.config.${MODULE}

  return new Module(CONFIG)
}
`
  return _r
}
