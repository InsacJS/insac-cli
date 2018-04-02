module.exports = (data) => {
  let content = data.fileContent

  data.KEY     = 'listar'
  data.isArray = true
  const LISTAR_OUTPUT = require('../../../example.output')(data)

  const _r = `${LISTAR_OUTPUT}
  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const Field = require(insac).Field', 'const Field = require(insac).Field')
  content = content.replace('// const THIS = require(insac).THIS', 'const THIS = require(insac).THIS')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
