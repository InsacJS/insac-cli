CONTROLLER.{{key}} = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      OPTIONS.paranoid = false
      OPTIONS.where = { id_{{modelName}}: req.params.id_{{modelName}} }
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        return app.{{moduleName}}.dao.{{modelName}}._findOne(t, OPTIONS)
      })
      res.success200(RESULTADO, 'La información ha sido obtenida con éxito.')
    } catch (err) { next(err) }
  }
