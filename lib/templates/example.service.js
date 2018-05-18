module.exports = (data) => {
  const _r = `const { InternalServer, Unauthorized, BadRequest } = require('insac').errors
const request = require('request')

module.exports = (app) => {
  const SERVICE = {}

  SERVICE.verificar = (token) => {
    return new Promise((resolve, reject) => {
      request.post(app.config.SERVICE.auth.verificarURL, {
        json: { token_acceso: token }
      }, (error, response) => {
        try {
          checkResponse(error, response)
          resolve(getBody(response))
        } catch (err) { reject(new InternalServer(err)) }
      })
    })
  }

  return SERVICE
}

function getBody (response) {
  return (typeof response.body === 'string') ? JSON.parse(response.body) : response.body
}

function checkResponse (error, response) {
  if (error) {
    if (['ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', 'ECONNREFUSED'].includes(error.code)) {
      throw new InternalServer(error, 'No se pudo establecer conexión con el Servidor de Autorización.')
    }
    throw new InternalServer(error)
  }
  const BODY = getBody(response)
  if (BODY.status === 'error') {
    if (response.statusCode === 400) { throw new BadRequest(BODY.errors) }
    if (response.statusCode === 401) { throw new Unauthorized(BODY.errors) }
    if (response.statusCode === 500) { throw new InternalServer('Error 500: Servidor de Autorización.') }
  }
}
`
  return _r
}
