const _ = require('lodash')

module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.model

  let pk
  let fields = []
  let audit = []

  let size1 = 0 // fields
  let size2 = 0 // fields + id
  let size3 = 0 // fields + id + audit

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD = MODEL.attributes[key]
    const isPk = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk) { pk = key }
    if (!isPk && !isAudit) { fields.push(key) }
    if (isAudit) { audit.push(key) }
    if (isField && (key.length > size1)) { size1 = key.length }
    if ((isField || isPk) && (key.length > size2)) { size2 = key.length }
    if ((isField || isPk || isAudit) && (key.length > size3)) { size3 = key.length }
  })
  // const PK = pk.toUpperCase()

  let _r = ``
  _r += `const { Field, THIS } = require(global.insac)\n\n`

  _r += `module.exports = (app) => {\n`
  _r += `  const OUTPUT = {}\n\n`

  _r += `  OUTPUT.listar = Field.group(app.${MODULE}.models.${model}, [{\n`
  _r += `    ${_.padEnd(pk, size2, ' ')}${fields.length === 0 ? ': THIS()' : ' : THIS(),'}\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `    ${_.padEnd(field, size2, ' ')} : THIS()${coma}\n`
  }
  _r += `  }])\n\n`

  _r += `  OUTPUT.obtener = Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `    ${_.padEnd(pk, size2, ' ')}${fields.length === 0 ? ': THIS()' : ' : THIS(),'}\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `    ${_.padEnd(field, size2, ' ')} : THIS()${coma}\n`
  }
  _r += `  })\n\n`

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

  _r += `  return OUTPUT\n`
  _r += `}\n`

  return _r
}
