module.exports = (data) => {
  const key     = data.key
  let   content = data.fileContent

  const _r = `INPUT.${key} = {
    query: {
      fields : Field.FIELDS,
      order  : Field.ORDER,
      limit  : Field.LIMIT,
      page   : Field.PAGE
    }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const Field = require(insac).Field', 'const Field = require(insac).Field')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
