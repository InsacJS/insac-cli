'use strict'
const { Seed } = require('insac')

module.exports = (insac) => {

  let data = [{
    estado: 'ACTIVO',
    id_usuario: 1,
    id_rol: 1
  }]

  return new Seed('rol_usuario', data)
}
