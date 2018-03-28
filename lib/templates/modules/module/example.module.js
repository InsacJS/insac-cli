module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const Module = require(insac).Module

module.exports = (app, config) => {
  const ${MODULE} = new Module(config)

  return ${MODULE}
}
`
  return _r
}
