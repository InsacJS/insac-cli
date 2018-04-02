module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const MODEL   = data.model
  const key     = data.key
  let   content = data.fileContent

  const pk = MODEL.primaryKeyAttribute
  const PK = pk.toUpperCase()

  const _r = `MIDDLEWARE.${key} = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro solicitado.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [COMPONENT] --!> //`

  content = content.replace('// const { NotFound } = require(insac).errors', 'const { NotFound } = require(insac).errors')

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
