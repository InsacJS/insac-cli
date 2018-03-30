const { errors, logger } = require(insac)

const moment = require('moment')
const _      = require('lodash')

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
      log(err, req)
    }

    return res.error(err)
  })
}

function log (err, req) {
  logger.error('\n\n ' + _.pad(' ERROR INTERNO ', 50, '\\') + ' \n')
  const FECHA      = moment().format('DD/MM/YYYY HH:MM:SS')
  const METHOD     = req.method
  const PATH_NAME  = req._parsedUrl.pathname
  const QUERY      = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY       = `\n${JSON.stringify(req.body, null, 2)}`

  let requestInfo = '\n\n'
  requestInfo += ` - FECHA     : ${FECHA}\n`
  requestInfo += ` - IP ORIGEN : ${req.connection.remoteAddress}\n`
  requestInfo += ` - NAVEGADOR : ${req.headers['user-agent']}\n`
  requestInfo += ` - URL       : [${METHOD}] ${PATH_NAME}\n`
  requestInfo += ` - QUERY     : ${QUERY}\n`
  requestInfo += ` - BODY      : ${BODY}\n`

  logger.error(requestInfo)
  logger.error(err, '')
}
