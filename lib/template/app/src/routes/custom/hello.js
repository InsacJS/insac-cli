'use strict'
const { Route, Fields } = require('insac')

module.exports = (insac, models, db) => {

  return new Route('GET', '/hello', {
    group: 'Custom',
    title: 'Hello',
    rol: 'admin',
    output: {
      msg: Fields.STRING({description:'Mensaje de bienvenida'})
    },
    middlewares: ['admin'],
    controller: (req) => {
      return { msg: `Bienvenido al mundo real`, token: req.token }
    }
  })

}
