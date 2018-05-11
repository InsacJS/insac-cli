const _ = require('lodash')

module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.model

  const TYPE    = data.ROUTE_TYPE.split(',')
  const GET     = TYPE.includes('get')
  const GET_ID  = TYPE.includes('getId')
  const CREATE  = TYPE.includes('create')
  const UPDATE  = TYPE.includes('update')
  const DESTROY = TYPE.includes('destroy')
  const RESTORE = TYPE.includes('restore')

  let pk
  let fields = []

  let size1 = 0 // fields

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD   = MODEL.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk) { pk = key }
    if (!isPk && !isAudit) { fields.push(key) }
    if (isField && (key.length > size1)) { size1 = key.length }
  })

  let _r = ``
  if (!GET_ID && !CREATE && !UPDATE && !DESTROY && !RESTORE) {
    _r += `const { Field } = require(insac)\n\n`
  } else {
    _r += `const { Field, THIS } = require(insac)\n\n`
  }

  _r += `module.exports = (app) => {\n`
  _r += `  const INPUT = {}\n\n`

  if (GET) {
    _r += `  INPUT.get = {\n`
    _r += `    query: {\n`
    _r += `      fields : Field.FIELDS,\n`
    _r += `      order  : Field.ORDER,\n`
    _r += `      limit  : Field.LIMIT,\n`
    _r += `      page   : Field.PAGE\n`
    _r += `    }\n`
    _r += `  }\n\n`
  }

  if (GET_ID) {
    _r += `  INPUT.getId = {\n`
    _r += `    query: {\n`
    _r += `      fields: Field.FIELDS\n`
    _r += `    },\n`
    _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
    _r += `      ${pk}: THIS({ allowNull: false })\n`
    _r += `    })\n`
    _r += `  }\n\n`
  }

  if (CREATE) {
    _r += `  INPUT.create = {\n`
    _r += `    body: Field.group(app.${MODULE}.models.${model}, {\n`
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const coma = (i !== fields.length - 1) ? ',' : ''
      _r += `      ${_.padEnd(field, size1, ' ')}${fields.length === 1 ? ': ' : ' : '}THIS({ allowNull: false })${coma}\n`
    }
    _r += `    })\n`
    _r += `  }\n\n`
  }

  if (UPDATE) {
    _r += `  INPUT.update = {\n`
    _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
    _r += `      ${pk}: THIS({ allowNull: false })\n`
    _r += `    }),\n`
    _r += `    body: Field.group(app.${MODULE}.models.${model}, {\n`
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const coma = (i !== fields.length - 1) ? ',' : ''
      _r += `      ${_.padEnd(field, size1, ' ')}${fields.length === 1 ? ': ' : ' : '}THIS({ allowNull: true })${coma}\n`
    }
    _r += `    })\n`
    _r += `  }\n\n`
  }

  if (DESTROY) {
    _r += `  INPUT.destroy = {\n`
    _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
    _r += `      ${pk}: THIS({ allowNull: false })\n`
    _r += `    })\n`
    _r += `  }\n\n`
  }

  if (RESTORE) {
    _r += `  INPUT.restore = {\n`
    _r += `    params: Field.group(app.${MODULE}.models.${model}, {\n`
    _r += `      ${pk}: THIS({ allowNull: false })\n`
    _r += `    })\n`
    _r += `  }\n\n`
  }

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //\n\n`

  _r += `  return INPUT\n`
  _r += `}\n`

  return _r
}
