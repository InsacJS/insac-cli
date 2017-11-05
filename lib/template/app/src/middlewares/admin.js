'use strict'
const { Middleware, Fields, ResponseErrors } = require('insac')
const { ForbiddenError } = ResponseErrors

module.exports = (insac, models, db) => {

  return new Middleware(`admin`, {
    input: {
      headers: {
        authorization: Fields.TOKEN({description:'Token de acceso', required:true})
      }
    },
    controller: (req, res, next) => {
      if (req.method == 'OPTIONS') {
        return next()
      }
      // Decodifica el token
      let tokenData = insac.decodeToken(req.headers.authorization)
      for (let i in tokenData.roles) {
        if (tokenData.roles[i] == 'admin') {
          let rolUsuarioOptions = {
            include: [{
              model: db.rol,
              as: 'rol',
              required: true,
              where: {
                alias: rol
              }
            }]
          }
          return db.rol_usuario.findOne(rolUsuarioOptions).then(rolUsuarioR => {
            if (!rolUsuarioR) {
              throw new ForbiddenError(`No existe el usuario.`)
            }
            // Guarda los datos del token
            req.token = tokenData
            return next()
          })
        }
      }
      throw new ForbiddenError(`No tiene los privilegios suficientes para acceder a este recurso.`)
    }
  })
}
