const Seed = require(insac).Seed

module.exports = (app) => {
  const DATA = [
    { id_{{modelName}}: 1 }
  ]

  DATA.forEach(data => {
    data._usuario_creacion = 1
  })

  return Seed.create(app.{{moduleName}}.models.{{modelName}}, DATA)
}
