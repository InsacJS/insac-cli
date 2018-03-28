module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName

  const _r = `const Seed = require(insac).Seed

module.exports = (app) => {
  const DATA = [
    { id_${model}: 1 }
  ]

  DATA.forEach(data => {
    data._usuario_creacion = 1
  })

  return Seed.create(app.${MODULE}.models.${model}, DATA)
}
`
  return _r
}
