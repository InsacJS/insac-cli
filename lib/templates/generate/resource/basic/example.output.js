const _ = require('lodash')

module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.model

  let pk
  let fields = []
  let size2  = 0 // fields + id

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD   = MODEL.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk) { pk = key }
    if (!isPk && !isAudit) { fields.push(key) }
    if ((isField || isPk) && (key.length > size2)) { size2 = key.length }
  })

  data.key     = 'listar'
  data.isArray = true
  const LISTAR_OUTPUT = require('../../../example.output')(data)

  let _r = ``
  _r += `const Field = require(insac).Field\n`
  _r += `const THIS = require(insac).THIS\n\n`

  _r += `module.exports = (app) => {\n`
  _r += `  const OUTPUT = {}\n\n`

  _r += `  ${LISTAR_OUTPUT}\n`

  _r += `  OUTPUT.obtener = OUTPUT.listar[0]\n\n`

  _r += `  OUTPUT.crear = Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `    ${_.padEnd(pk, size2, ' ')}${fields.length === 0 ? ': THIS()' : ' : THIS(),'}\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `    ${_.padEnd(field, size2, ' ')} : THIS()${coma}\n`
  }
  _r += `  })\n\n`

  _r += `  OUTPUT.actualizar = null\n\n`

  _r += `  OUTPUT.eliminar = null\n\n`

  _r += `  OUTPUT.restaurar = null\n\n`

  _r += `  // <!-- [CLI] - [ROUTE] --!> //\n\n`

  _r += `  return OUTPUT\n`
  _r += `}\n`

  return _r
}
