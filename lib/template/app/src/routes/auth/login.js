'use strict'
const { Route, Fields, ResponseErrors } = require('insac')
const { UnauthorizedError } = ResponseErrors

module.exports = (insac, models, db) => {

  const Usuario = models.usuario.fields
  const Rol = models.rol.fields

  return new Route('POST', `/auth/login`, {
    group: 'Auth',
    title: 'Login',
    input: {
      body: {
        username: Fields.COPY(Usuario.username, {required:true}),
        password: Fields.COPY(Usuario.password, {required:true})
      }
    },
    output: {
      token: Fields.TOKEN(),
      usuario: {
        id: Fields.COPY(Usuario.id),
        email: Fields.COPY(Usuario.email),
        roles: [{
          id: Fields.COPY(Rol.id),
          nombre: Fields.COPY(Rol.nombre),
          alias: Fields.COPY(Rol.alias)
        }]
      },
      id_administrativo: Fields.INTEGER({description:'Identificador único del administrativo.', required:false})
    },
    controller: (req) => {
      let usuarioOptions = {
        where: {
          username: req.body.username,
          password: insac.encryptPassword(req.body.password)
        },
        include: [
          {model: db.rol_usuario, as:'roles_usuarios', where:{estado:'ACTIVO'}, include: [
            {model: db.rol, as:'rol'}
          ]},
          {model: db.persona, as:'persona', include:[
            {model: db.administrativo, as:'administrativo'}
          ]}
        ]
      }
      return db.usuario.findOne(usuarioOptions).then(usuarioR => {
        if (!usuarioR) {
          throw new UnauthorizedError(`Usuario y/o contraseña incorrecto.`)
        }
        let data = {
          usuario: {
            id: usuarioR.id,
            nombre: usuarioR.nombre,
            email: usuarioR.email
          }
        }
        if (usuarioR.persona.administrativo != null) { data.id_administrativo = usuarioR.persona.administrativo.id }
        let roles = [], tokenRoles = []
        for (let i in usuarioR.roles_usuarios) {
          roles.push(usuarioR.roles_usuarios[i].rol)
          tokenRoles.push(usuarioR.roles_usuarios[i].rol.alias)
        }
        data.usuario.roles = roles
        let tokenData = {
          usuario: { id:usuarioR.id },
          nombre: usuarioR.nombre,
          id_administrativo: data.id_administrativo,
          roles: tokenRoles
        }
        data.token = insac.createToken(tokenData)
        return data
      })
    }
  })

}
