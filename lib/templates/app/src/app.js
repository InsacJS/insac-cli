const { Insac } = require('insac')

const service = new Insac()

// <!-- [CLI] - [MODULE] --!> //

service.init().catch(e => {
  console.error(e)
  process.exit(1)
})

module.exports = service
