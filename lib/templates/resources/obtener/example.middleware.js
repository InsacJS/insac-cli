MIDDLEWARE.{{key}} = [
    async (req, res, next) => {
      try {
        const ID_{{MODEL_NAME}} = req.params.id_{{modelName}}
        if (!await app.{{moduleName}}.dao.{{modelName}}.findOne(null, { id_{{modelName}}: ID_{{MODEL_NAME}} })) {
          throw new errors.NotFound(`No se encuentra el registro solicitado.`)
        }
        next()
      } catch (err) { next(err) }
    }
  ]
