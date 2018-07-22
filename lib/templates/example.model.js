const _ = require('lodash')

module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const schema  = MODULE.toLowerCase()
  const example = data.example

  const PROP = `{
      comment : '',
      example : ''
    }`

  const PROP_ID = `{
      comment: 'ID ${model}.'
    }`

  const audit = [
    { field: '_estado',               value: 'Field._STATUS()' },
    { field: '_usuario_creacion',     value: 'Field._CREATED_USER()' },
    { field: '_usuario_modificacion', value: 'Field._UPDATED_USER()' },
    { field: '_usuario_eliminacion',  value: 'Field._DELETED_USER()' },
    { field: '_fecha_creacion',       value: 'Field._CREATED_AT()' },
    { field: '_fecha_modificacion',   value: 'Field._UPDATED_AT()' },
    { field: '_fecha_eliminacion',    value: 'Field._DELETED_AT()' }
  ]

  let fields = [
    { field: `id_${model}`, value: `Field.ID(${PROP_ID})` }
  ]
  data.fields.forEach(f => {
    const field = f.indexOf(':') !== -1 ? f.split(':')[0] : f
    const type = f.indexOf(':') !== -1 ? f.split(':')[1] : 'STRING'
    fields.push({ field, value: `Field.${type}(${PROP})` })
  })

  let _r = ``
  _r += `const { Field } = require('insac')\n\n`

  _r += `module.exports = (sequelize, Sequelize) => {\n`
  _r += `  const MODEL = sequelize.define('${model}', {\n`
  for (let i = 0; i < fields.length; i++) {
    _r += `    ${fields[i].field}: ${fields[i].value},\n`
  }
  for (let i = 0; i < audit.length; i++) {
    _r += `    ${_.padEnd(audit[i].field, 21, ' ')} : ${audit[i].value}${i === audit.length - 1 ? '' : ','}\n`
  }
  _r += `  }, {\n`
  _r += `    schema: '${schema}'\n`
  _r += `  })\n\n`

  _r += `  MODEL.associate = (app) => {\n`
  _r += `    // TODO\n`
  _r += `  }\n\n`

  _r += example ? `  // Ejemplo.-
  //
  // ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  // │    LIBRO    │         │    AUTOR    |         │   PERSONA   │
  // ├─────────────┤       1 ├─────────────┤       1 ├─────────────┤
  // │ id_libro    │ N  ┌────┤ id_autor    | 1  ┌────┤ id_persona  │
  // │ fid_autor   │<───┘    │ fid_persona │<───┘    │             │
  // └─────────────┘         └─────────────┘         └─────────────┘
  //
  // const LIBRO   = app.API.models.libro
  // const AUTOR   = app.API.models.autor
  // const PERSONA = app.API.models.persona
  //
  // LIBRO.belongsTo(AUTOR, { as: 'autor',  foreignKey: { name: 'fid_autor', targetKey: 'id_autor' } })
  // AUTOR.hasMany(LIBRO,   { as: 'libros', foreignKey: { name: 'fid_autor' } })
  //
  // AUTOR.belongsTo(PERSONA, { as: 'persona', foreignKey: { name: 'fid_persona', targetKey: 'id_persona', allowNull: false } })
  // PERSONA.hasOne(AUTOR,    { as: 'autor',   foreignKey: { name: 'fid_persona' } })\n\n` : ''

  _r += `  return MODEL\n`
  _r += `}\n`

  return _r
}
