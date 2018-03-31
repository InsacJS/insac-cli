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

  // Muestra las peticiones por consola
  if (process.env.REQUEST_LOG && process.env.REQUEST_LOG === 'true') {
    app.use((req, res, next) => {
      logger.request(req)
      return next()
    })
  }

  // Carga las librerias personalizadas
  require('../tools/Field.js')
  require('../tools/util.js')
}
