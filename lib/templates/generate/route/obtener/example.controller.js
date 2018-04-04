module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const MODEL   = data.model
  const key     = data.key
  let   content = data.fileContent

  const pk = MODEL.primaryKeyAttribute
  const PK = pk.toUpperCase()

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ${PK} = req.params.${pk}
      OPTIONS.where = { ${pk}: ${PK} }
      const RESULTADO = await app.${MODULE}.dao.${model}._findOne(null, OPTIONS)
      return res.success200(RESULTADO, 'La información del registro ha sido obtenida con éxito.')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
