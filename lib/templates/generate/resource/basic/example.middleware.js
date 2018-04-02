module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.modelName.toUpperCase()

  let pk
  let fields = []
  let audit  = []

  let size1 = 0 // fields
  let size2 = 0 // fields + id
  let size3 = 0 // fields + id + audit

  let attributes = ''

  Object.keys(data.model.attributes).forEach(key => {
    const FIELD   = data.model.attributes[key]
    const isPk    = FIELD.primaryKey === true
    const isAudit = key.startsWith('_')
    const isField = !isPk && !isAudit
    if (isPk)              { pk = key }
    if (!isPk && !isAudit) { fields.push(key) }
    if (isAudit)           { audit.push(key) }
    if (isField)           { attributes += `, '${key}'` }
    if (isField                      && (key.length > size1)) { size1 = key.length }
    if ((isField || isPk)            && (key.length > size2)) { size2 = key.length }
    if ((isField || isPk || isAudit) && (key.length > size3)) { size3 = key.length }
  })
  attributes = attributes.substr(2)
  const PK   = pk.toUpperCase()

  const _r = `const { NotFound, BadRequest } = require(global.insac).errors
const util = require(global.insac).util

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = null

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

  MIDDLEWARE.crear = null

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
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} }, null, false)) {
          throw new NotFound('No se encuentra el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [ROUTE] --!> //

  return MIDDLEWARE
}
`
  return _r
}
