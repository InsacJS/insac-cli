INPUT.{{routeKey}} = {
  headers: {
    authorization: Field.BEARER_AUTHORIZATION
  },
  query: {
    fields: Field.FIELDS
  },
  params: Field.group(app.{{moduleName}}.models.{{modelName}}, {
    // TODO
  }),
  body: Field.group(app.{{moduleName}}.models.{{modelName}}, {
    // TODO
  })
}
