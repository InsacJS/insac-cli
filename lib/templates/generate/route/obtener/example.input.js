module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const MODEL   = data.model
  const key     = data.key
  let   content = data.fileContent

  const pk = MODEL.primaryKeyAttribute

  const _r = `INPUT.${key} = {
    query: {
      fields: Field.FIELDS
    },
    params: Field.group(app.${MODULE}.models.${model}, {
      ${pk}: THIS({ allowNull: false })
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const Field = require(insac).Field', 'const Field = require(insac).Field')
  content = content.replace('// const THIS = require(insac).THIS', 'const THIS = require(insac).THIS')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
