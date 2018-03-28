module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const ServiceModule = require(insac).ServiceModule

module.exports = (app, config) => {
  const ${MODULE} = new ServiceModule(config)

  return ${MODULE}
}
`
  return _r
}
