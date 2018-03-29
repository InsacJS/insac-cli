const _ = require('lodash')

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
  if (process.env.LOGGER_REQ && process.env.LOGGER_REQ === 'true') {
    app.use((req, res, next) => {
      const METHOD     = req.method
      const PATH_NAME  = req._parsedUrl.pathname
      const QUERY      = req._parsedUrl.search ? `\n\x1b[2mquery = ${req._parsedUrl.search}\x1b[0m` : ''
      const BODY       = Object.keys(req.body).length > 0 ? `\n\x1b[2mbody = ${JSON.stringify(req.body, null, 2)}\x1b[0m` : ''
      process.stdout.write(`\n${_.padEnd(`[${METHOD}]`, 8, ' ')} ${PATH_NAME}${QUERY}${BODY}\n`)
      return next()
    })
  }

  // Importa los campos personalizados
  require('../tools/Field.js')
}
