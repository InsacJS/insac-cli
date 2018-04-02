const _ = require('lodash')

module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const MODEL   = data.model
  const key     = data.key

  let content = data.fileContent
  let fields  = []

  let size1 = 0 // fields

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD   = MODEL.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (!isPk && !isAudit) { fields.push(key) }
    if (isField && (key.length > size1)) { size1 = key.length }
  })

  let _r = ``

  _r += `INPUT.${key} = {\n`
  _r += `    body: Field.group(app.${MODULE}.models.${model}, {\n`
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const coma = (i !== fields.length - 1) ? ',' : ''
    _r += `      ${_.padEnd(field, size1, ' ')} : THIS({ allowNull: false })${coma}\n`
  }  _r += `    })\n`
  _r += `  }\n\n`

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const Field = require(insac).Field', 'const Field = require(insac).Field')
  content = content.replace('// const THIS = require(insac).THIS', 'const THIS = require(insac).THIS')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
