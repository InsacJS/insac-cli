module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const Module = require(insac).Module

module.exports = (app) => {
  const ${MODULE} = new Module(app.config.${MODULE})

  return ${MODULE}
}
`
  return _r
}
