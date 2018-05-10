module.exports = (data) => {
  const MODULE = data.moduleName

  const _r = `const { ResourceModule } = require(insac)

module.exports = (app) => {
  const ${MODULE} = new ResourceModule(app.config.${MODULE})

  return ${MODULE}
}
`
  return _r
}
