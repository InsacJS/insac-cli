INPUT.{{key}} = {
    query: {
      fields: Field.FIELDS
    },
    params: Field.group(app.{{moduleName}}.models.{{modelName}}, {
      id_{{modelName}}: THIS({ allowNull: false })
    })
  }
