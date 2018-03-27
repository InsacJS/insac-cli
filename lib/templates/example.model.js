const Field = require(insac).Field

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('{{modelName}}', {
    id_{{modelName}}: Field.ID({
      description: 'ID {{modelName}}.'
    }),
    // TODO
    _usuario_creacion     : Field.CREATED_USER,
    _usuario_modificacion : Field.UPDATED_USER,
    _usuario_eliminacion  : Field.DELETED_USER,
    _fecha_creacion       : Field.CREATED_AT,
    _fecha_modificacion   : Field.UPDATED_AT,
    _fecha_eliminacion    : Field.DELETED_AT
  }, {
    schema: '{{schemaName}}'
  })

  MODEL.associate = (app) => {
    // TODO
  }

  return MODEL
}
