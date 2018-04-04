module.exports = (data) => {
  const key     = data.key
  const MODULE  = data.moduleName
  const model   = data.modelName
  let   content = data.fileContent

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.${MODULE}.dao.${model}._findAndCountAll(null, OPTIONS)
      return res.success200(RESULTADO.rows, 'La lista de registros ha sido obtenida con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const util = require(insac).util', 'const util = require(insac).util')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
