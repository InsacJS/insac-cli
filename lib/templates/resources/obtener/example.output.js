OUTPUT.{{key}} = Field.group(app.{{moduleName}}.models.{{modelName}}, {
  {{#each model.attributes}}
    {{this.fieldName}} : THIS(){{this.coma}}
  {{/each}}
  })
