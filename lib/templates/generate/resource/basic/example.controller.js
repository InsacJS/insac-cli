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
  const PK = pk.toUpperCase()

  let _r = ''

  if (GET || UPDATE) {
    if (UPDATE) {
      _r += `const _ = require('lodash')\n\n`
    }
    _r += `const { util } = require('insac')\n\n`
  }

  _r += `module.exports = (app) => {
  const CONTROLLER = {}\n\n`

  if (GET) {
    _r += `  CONTROLLER.get = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.${MODULE}.dao.${model}._findAndCountAll(null, OPTIONS)
      return res.success200(RESULTADO.rows, 'Los registros han sido obtenidos con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }\n\n`
  }

  if (GET_ID) {
    _r += `  CONTROLLER.getId = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ${PK} = req.params.${pk}
      OPTIONS.where = { ${pk}: ${PK} }
      const RESULTADO = await app.${MODULE}.dao.${model}._findOne(null, OPTIONS)
      return res.success200(RESULTADO, 'El registro ha sido obtenido con éxito.')
    } catch (err) { return next(err) }
  }\n\n`
  }

  if (CREATE) {
    _r += `  CONTROLLER.create = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${MODEL} = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        ${MODEL}._usuario_creacion = ID_USUARIO_SESION
        return app.${MODULE}.dao.${model}.create(t, ${MODEL})
      })
      return res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }\n\n`
  }

  if (UPDATE) {
    _r += `  CONTROLLER.update = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      const FIELDS = [${attributes}]
      const ${MODEL} = _.pick(req.body, FIELDS)
      await app.DB.sequelize.transaction(async (t) => {
        ${MODEL}._usuario_modificacion = ID_USUARIO_SESION
        await app.${MODULE}.dao.${model}.update(t, ${MODEL}, { ${pk}: ${PK} })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }\n\n`
  }

  if (DESTROY) {
    _r += `  CONTROLLER.destroy = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      await app.DB.sequelize.transaction(async (t) => {
        const ${MODEL} = {}
        ${MODEL}._estado = 'ELIMINADO'
        ${MODEL}._usuario_eliminacion = ID_USUARIO_SESION
        await app.${MODULE}.dao.${model}.destroy(t, ${MODEL},  { ${pk}: ${PK} })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }\n\n`
  }

  if (RESTORE) {
    _r += `  CONTROLLER.restore = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      await app.DB.sequelize.transaction(async (t) => {
        const ${MODEL} = {}
        ${MODEL}._estado = 'ACTIVO'
        ${MODEL}._usuario_modificacion = ID_USUARIO_SESION
        ${MODEL}._usuario_eliminacion  = null
        await app.${MODULE}.dao.${model}.restore(t, ${MODEL}, { ${pk}: ${PK} })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }\n\n`
  }

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //

  return CONTROLLER
}
`
  return _r
}
