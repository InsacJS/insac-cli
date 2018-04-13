module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.modelName.toUpperCase()

  let pk
  let attributes = ''

  Object.keys(data.model.attributes).forEach(key => {
    const FIELD   = data.model.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk) { pk = key }
    if (isField) { attributes += `, '${key}'` }
  })
  attributes = attributes.substr(2)
  const PK   = pk.toUpperCase()

  const _r = `const { NotFound, BadRequest } = require(global.insac).errors
const util = require(global.insac).util

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = []

  MIDDLEWARE.obtener = [
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

  MIDDLEWARE.crear = []

  MIDDLEWARE.actualizar = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        const FIELDS = [${attributes}]
        const ${MODEL} = util.obj(req.body, FIELDS)
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro que desea actualizar.')
        }
        if (Object.keys(${MODEL}).length === 0) {
          throw new BadRequest('Debe enviar al menos un dato válido, para actualizar el registro.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.eliminar = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro que desea eliminar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.restaurar = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} }, null, null, false)) {
          throw new NotFound('No se encuentra el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [COMPONENT] --!> //

  return MIDDLEWARE
}
`
  return _r
}
