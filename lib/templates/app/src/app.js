const { Insac } = require('insac')

const service = new Insac()

service.addModule('UTIL')
// <!-- [CLI] - [MODULE] --!> //

service.init()

module.exports = service
