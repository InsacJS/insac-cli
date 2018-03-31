const { errors, logger } = require(insac)

module.exports = (app) => {
  // |=======================================================================|
  // |--- TAREAS A REALIZAR DESPUÉS DE INSTALAR O INICIALIZAR LOS MÓDULOS ---|
  // |=======================================================================|

  // Controla las rutas no definidas
  app.use((req, res, next) => {
    return res.status(404).send('Not Found')
  })

  // Controla los errores
  app.use((err, req, res, next) => {
    if (err && (err.name === 'InputDataValidationError')) {
      err = errors.BadRequest.create(err.errors)
    }

    if (err.name !== 'ResponseHandlerError') {
      err = errors.InternalServer.create(err)
    }

    if (err.code === 500) {
      logger.error500(req, err)
    }

    return res.error(err)
  })
}
