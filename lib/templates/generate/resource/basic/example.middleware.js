module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName
  const MODEL  = data.modelName.toUpperCase()

  const TYPE    = data.ROUTE_TYPE.split(',')
  const GET     = TYPE.includes('get')
  const GET_ID  = TYPE.includes('getId')
  const CREATE  = TYPE.includes('create')
  const UPDATE  = TYPE.includes('update')
  const DESTROY = TYPE.includes('destroy')
  const RESTORE = TYPE.includes('restore')

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

  let _r = ''

  // _ UPDATE
  // errors: GET_ID, UPDATE, DESTROY; RESTORE
  // NotFound: GET_ID, UPDATE, DESTROY; RESTORE
  // BadRequest: UPDATE

  if (GET_ID || DESTROY || RESTORE) {
    if (UPDATE) {
      _r += `const _ = require ('lodash')\n\n
const { errors } = require('insac')
const { NotFound, BadRequest } = errors\n\n`
    } else {
      _r += `const { errors } = require('insac')
const { NotFound } = errors\n\n`
    }
  } else if (UPDATE) {
    _r += `const _ = require ('lodash')\n\n
const { errors } = require('insac')
const { NotFound, BadRequest } = errors\n\n`
  }

  _r += `module.exports = (app) => {
  const MIDDLEWARE = {}\n\n`

  if (GET) {
    _r += `  MIDDLEWARE.get = []\n\n`
  }

  if (GET_ID) {
    _r += `  MIDDLEWARE.getId = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro solicitado.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]\n\n`
  }

  if (CREATE) {
    _r += `  MIDDLEWARE.create = []\n\n`
  }

  if (UPDATE) {
    _r += `  MIDDLEWARE.update = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        const FIELDS = [${attributes}]
        const ${MODEL} = _.pick(req.body, FIELDS)
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro que desea actualizar.')
        }
        if (Object.keys(${MODEL}).length === 0) {
          throw new BadRequest('Debe enviar al menos un dato válido, para actualizar el registro.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]\n\n`
  }

  if (DESTROY) {
    _r += `  MIDDLEWARE.destroy = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} })) {
          throw new NotFound('No se encuentra el registro que desea eliminar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]\n\n`
  }

  if (RESTORE) {
    _r += `  MIDDLEWARE.restore = [
    async (req, res, next) => {
      try {
        const ${PK} = req.params.${pk}
        if (!await app.${MODULE}.dao.${model}.findOne(null, { ${pk}: ${PK} }, null, null, false)) {
          throw new NotFound('No se encuentra el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]\n\n`
  }

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //

  return MIDDLEWARE
}
`
  return _r
}
