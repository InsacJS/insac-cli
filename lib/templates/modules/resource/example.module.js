module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const ResourceModule = require(insac).ResourceModule

module.exports = (app, config) => {
  const ${MODULE} = new ResourceModule(config)

  return ${MODULE}
}
`
  return _r
}
