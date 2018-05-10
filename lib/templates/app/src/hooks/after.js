const { errors, logger, stdout } = require(insac)

module.exports = (app) => {
  // |=======================================================================|
  // |--- TAREAS A REALIZAR DESPUÉS DE INSTALAR O INICIALIZAR LOS MÓDULOS ---|
  // |=======================================================================|

  // Controla el método OPTIONS y las rutas no definidas.
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).send('ok')
    }
    return res.status(404).send('Not Found')
  })

  // Controla los errores
  app.use((err, req, res, next) => {
    if (err && (err.name === 'InputDataValidationError')) {
      err = errors.BadRequest.create(err.errors)
    }

    if (err instanceof SyntaxError) {
      err = errors.BadRequest.create('Error de sintaxis, posiblemente en el formato JSON.')
    }

    if (err.name !== 'ResponseHandlerError') {
      err = errors.InternalServer.create(err)
    }

    if (err.code === 500) {
      logger.error500(req, err)
      stdout.error500(req, err)
      return res.error(err)
    }

    if (process.env.REQUEST_LOG && process.env.REQUEST_LOG === 'true') {
      if (err.code !== 500) {
        logger.requestError(req, err)
        stdout.requestError(req, err)
      }
    }
    return res.error(err)
  })
}
