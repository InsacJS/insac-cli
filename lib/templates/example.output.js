OUTPUT.{{routeKey}} = Field.group(app.{{moduleName}}.models.{{modelName}}, {
  id_{{modelName}}: THIS(),
  _fecha_creacion     : THIS(),
  _fecha_modificacion : THIS(),
  _fecha_eliminacion  : THIS()
})
