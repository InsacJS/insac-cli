const _ = require('lodash')

module.exports = (data) => {
  const model = data.modelName
  const mod   = data.moduleName
  const app   = data.app
  const count = data.count

  const MODEL = app[mod].models[model]

  let fields = []

  let size1 = 0 // fields

  Object.keys(MODEL.attributes).forEach(key => {
    const FIELD   = MODEL.attributes[key]
    const isAudit = key.startsWith('_')
    if (!isAudit) {
      fields.push({ name: key, example: _getExample(FIELD), isPK: FIELD.primaryKey })
      if (key.length > size1) { size1 = key.length }
    }
  })

  let props = ''
  for (let j = 0; j < fields.length; j++) {
    const field = fields[j]
    field.example = field.isPK ? `i` : field.example
    const coma = (j !== fields.length - 1) ? ',' : ''
    props += `      ${_.padEnd(field.name, size1, ' ')}${fields.length === 1 ? ': ' : ' : '}${field.example}${coma}\n`
  }

  let _r = ``
  _r += `module.exports = (app) => {\n`
  _r += `  const DATA = []\n\n`
  _r += `  for (let i = 1; i <= ${count}; i++) {\n`
  _r += `    DATA.push({\n`
  _r += `${props}\n`
  _r += `    })\n`
  _r += `  }\n\n`
  _r += `  return DATA\n\n`
  _r += `}\n`

  return _r
}

function _getExample (field) {
  const IS_UNDEFINED = typeof field.example === 'undefined'
  const IS_STRING    = typeof field.example === 'string'
  const IS_OBJECT    = typeof field.example === 'object'
  if (!IS_UNDEFINED && (!IS_STRING || (IS_STRING && (field.example !== '')))) {
    if (IS_STRING) { return `'${field.example}'` }
    return IS_OBJECT ? _.replace(JSON.stringify(field.example), /"/g, '\'') : `${field.example}`
  }
  if (field.defaultValue)            { return `'${field.defaultValue}'` }
  if (field.type.key === 'STRING')   { return `'text'` }
  if (field.type.key === 'TEXT')     { return `'text'` }
  if (field.type.key === 'INTEGER')  { return `1` }
  if (field.type.key === 'FLOAT')    { return `12.99` }
  if (field.type.key === 'BOOLEAN')  { return `false` }
  if (field.type.key === 'ENUM')     { return `'${field.type.values[0]}'` }
  if (field.type.key === 'JSON')     { return `{ json: { data: 'value' } }` }
  if (field.type.key === 'JSONB')    { return `{ jsonb: { data: 'value' } }` }
  if (field.type.key === 'DATE')     { return `'2018-02-03T00:39:45.113Z'` }
  if (field.type.key === 'DATEONLY') { return `'2018-02-03'` }
  if (field.type.key === 'TIME')     { return `'08:12:30'` }
  if (field.type.key === 'UUID')     { return `'15dab328-07dc-4400-a5ea-55f836c40f31'` }
  if (field.type.key === 'ARRAY') {
    if (field.type.type.key === 'STRING')   { return `['text']` }
    if (field.type.type.key === 'TEXT')     { return `['text']` }
    if (field.type.type.key === 'INTEGER')  { return `[1]` }
    if (field.type.type.key === 'FLOAT')    { return `[12.99]` }
    if (field.type.type.key === 'BOOLEAN')  { return `[false]` }
    if (field.type.type.key === 'ENUM')     { return `['${field.type.type.values[0]}']` }
    if (field.type.type.key === 'JSON')     { return `[{ json: { data: 'value' } }]` }
    if (field.type.type.key === 'JSONB')    { return `[{ jsonb: { data: 'value' } }]` }
    if (field.type.type.key === 'DATE')     { return `['2018-02-03T00:39:45.113Z']` }
    if (field.type.type.key === 'DATEONLY') { return `['2018-02-03']` }
    if (field.type.type.key === 'TIME')     { return `['08:12:30']` }
    if (field.type.type.key === 'UUID')     { return `['15dab328-07dc-4400-a5ea-55f836c40f31']` }
    return `['example']`
  }
  return `'example'`
}
