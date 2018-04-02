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
      comment: 'ID ${model}'
    }`

  const audit = [
    { field: '_estado',               value: 'Field.STATUS' },
    { field: '_usuario_creacion',     value: 'Field.CREATED_USER' },
    { field: '_usuario_modificacion', value: 'Field.UPDATED_USER' },
    { field: '_usuario_eliminacion',  value: 'Field.DELETED_USER' },
    { field: '_fecha_creacion',       value: 'Field.CREATED_AT' },
    { field: '_fecha_modificacion',   value: 'Field.UPDATED_AT' },
    { field: '_fecha_eliminacion',    value: 'Field.DELETED_AT' }
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
  _r += `const Field = require(insac).Field\n\n`

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
  // ┌─────────────┐         ┌─────────────┐         ┌─────────────────┐         ┌─────────┐
  // │   PERSONA   │         │   USUARIO   │         │   ROL_USUARIO   │         │   ROL   │
  // ├─────────────┤       1 ├─────────────┤ 1       ├─────────────────┤       1 ├─────────┤
  // │ id_persona  │ 1  ┌────┤ id_usuario  ├────┐  N │ id_rol_usuario  │    ┌────┤ id_rol  │
  // │ fid_usuario │<───┘    └─────────────┘    └───>│ fid_usuario     │ N  │    └─────────┘
  // └─────────────┘                                 │ fid_rol         │<───┘
  //                                                 └─────────────────┘
  //
  // PERSONA.belongsTo(USUARIO, { as:'usuario', foreignKey: { name: 'fid_usuario', targetKey: 'id_usuario', allowNull: false } })
  //
  // USUARIO.hasOne(PERSONA,      { as: 'persona', foreignKey: { name: 'fid_usuario' } })
  // USUARIO.hasMany(ROL_USUARIO, { as: 'roles',   foreignKey: { name: 'fid_usuario' } })
  //
  // ROL_USUARIO.belongsTo(USUARIO, { as: 'usuario', foreignKey: { name: 'fid_usuario', targetKey: 'id_usuario', allowNull: false } })
  // ROL_USUARIO.belongsTo(ROL,     { as: 'rol',     foreignKey: { name: 'fid_rol',     targetKey: 'id_rol',     allowNull: false } })
  //
  // ROL.hasMany(ROL_USUARIO, { as: 'usuarios', foreignKey: { name: 'fid_rol' } })\n\n` : ''

  _r += `  return MODEL\n`
  _r += `}\n`

  return _r
}
