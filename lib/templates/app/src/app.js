const { Insac } = require('insac')

const service = new Insac()

service.addModule('util')
// <!-- [CLI] - [MODULE] --!> //

service.init()

module.exports = service
