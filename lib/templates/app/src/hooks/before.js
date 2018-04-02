const logger = require(insac).logger

module.exports = (app) => {
  // |======================================================================|
  // |---- TAREAS A REALIZAR ANTES DE INSTALR O INICIALIZAR LOS MÓDULOS ----|
  // |======================================================================|

  // Controla el método OPTIONS
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).send('ok')
    }
    return next()
  })

  // Muestra información de una petición entrante.
  if (process.env.REQUEST_LOG && process.env.REQUEST_LOG === 'true') {
    app.use((req, res, next) => {
      logger.requestPath(req)
      logger.requestQuery(req)
      logger.requestBody(req)
      return next()
    })
  }

  // Personaliza las herramientas.
  require('../tools/Field.js')
  require('../tools/util.js')
  require('../tools/auth.js')
  require('../tools/logger.js')
}
