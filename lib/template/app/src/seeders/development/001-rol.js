'use strict'
const { Seed } = require('insac')

module.exports = (insac) => {

  let data = insac.config.auth.roles

  return new Seed('rol', data)
}
