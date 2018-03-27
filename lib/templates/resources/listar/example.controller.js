CONTROLLER.{{key}} = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      OPTIONS.paranoid = false
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        return app.{{moduleName}}.dao.{{modelName}}._findAndCountAll(t, OPTIONS)
      })
      res.success200(RESULTADO.rows, 'La lista ha sido obtenida con éxito.', { count: RESULTADO.count })
    } catch (err) { next(err) }
  }
