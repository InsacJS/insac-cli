const _ = require('lodash')

module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.model

  let pk
  let fields = []
  let audit  = []

  let size1 = 0 // fields
  let size2 = 0 // fields + id
  let size3 = 0 // fields + id + audit

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD   = MODEL.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk)              { pk = key }
    if (!isPk && !isAudit) { fields.push(key) }
    if (isAudit)           { audit.push(key) }
    if (isField                      && (key.length > size1)) { size1 = key.length }
    if ((isField || isPk)            && (key.length > size2)) { size2 = key.length }
    if ((isField || isPk || isAudit) && (key.length > size3)) { size3 = key.length }
  })

  let _r = ``
  _r += `const { Field, THIS } = require(global.insac)\n\n`

  _r += `module.exports = (app) => {\n`
  _r += `  const INPUT = {}\n\n`

  _r += `  INPUT.listar = {\n`
  _r += `    query: {\n`
  _r += `      fields : Field.FIELDS,\n`
  _r += `      order  : Field.ORDER,\n`
  _r += `      limit  : Field.LIMIT,\n`
  _r += `      page   : Field.PAGE\n`
  _r += `    }\n`
  _r += `  }\n\n`

  _r += `  INPUT.obtener = {\n`
  _r += `    query: {\n`
  _r += `      fields: Field.FIELDS\n`
  _r += `    },\n`
  _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `      ${pk}: THIS({ allowNull: false })\n`
  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  INPUT.crear = {\n`
  _r += `    body: Field.group(app.${MODULE}.models.${model}, {\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `      ${_.padEnd(field, size1, ' ')} : THIS({ allowNull: false })${coma}\n`
  }  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  INPUT.actualizar = {\n`
  _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `      ${pk}: THIS({ allowNull: false })\n`
  _r += `    }),\n`
  _r += `    body: Field.group(app.${MODULE}.models.${model}, {\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `      ${_.padEnd(field, size1, ' ')} : THIS({ allowNull: true })${coma}\n`
  }
  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  INPUT.eliminar = {\n`
  _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `      ${pk}: THIS({ allowNull: false })\n`
  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  INPUT.restaurar = {\n`
  _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
  _r += `      ${pk}: THIS({ allowNull: false })\n`
  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  // <!-- [CLI] - [ROUTE] --!> //\n\n`

  _r += `  return INPUT\n`
  _r += `}\n`

  return _r
}
