CONTROLLER.{{key}} = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const {{MODEL_NAME}} = {
        {{#each model.attributes}}
        {{this.fieldName}} : req.body.{{this.fieldName}}{{this.coma}}
        {{/each}}
      }
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        {{MODEL_NAME}}._usuario_creacion = ID_USUARIO_SESION
        return app.{{moduleName}}.dao.{{modelName}}.create(t, {{MODEL_NAME}})
      })
      res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { next(err) }
  }
