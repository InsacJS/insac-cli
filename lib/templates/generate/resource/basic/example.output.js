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

  data.key     = 'get'
  data.isArray = true
  const GET_OUTPUT = require('../../../example.output')(data)
  data.key     = 'getId'
  data.isArray = false
  const GET_ID_OUTPUT = require('../../../example.output')(data)

  let _r = ``
  if (GET || GET_ID || CREATE) {
    _r += `const { Field, THIS } = require(insac)\n\n`
  }

  _r += `module.exports = (app) => {\n`
  _r += `  const OUTPUT = {}\n\n`

  if (GET) {
    _r += `  ${GET_OUTPUT}\n`
  }

  if (GET_ID) {
    _r += `  ${GET_ID_OUTPUT}\n`
  }

  if (CREATE) {
    _r += `  OUTPUT.create = Field.group(app.${MODULE}.models.${model}, {\n`
    _r += `    ${_.padEnd(pk, size2, ' ')}${fields.length === 0 ? ': THIS()' : ' : THIS(),'}\n`
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const coma = (i !== fields.length - 1) ? ',' : ''
      _r += `    ${_.padEnd(field, size2, ' ')} : THIS()${coma}\n`
    }
    _r += `  })\n\n`
  }

  if (UPDATE) {
    _r += `  OUTPUT.update = null\n\n`
  }

  if (DESTROY) {
    _r += `  OUTPUT.destroy = null\n\n`
  }

  if (RESTORE) {
    _r += `  OUTPUT.restore = null\n\n`
  }

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //\n\n`

  _r += `  return OUTPUT\n`
  _r += `}\n`

  return _r
}
