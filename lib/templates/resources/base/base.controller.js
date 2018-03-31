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
  const PK = pk.toUpperCase()

  const _r = `const util   = require(global.insac).util

module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        return app.${MODULE}.dao.${model}._findAndCountAll(t, OPTIONS)
      })
      res.success200(RESULTADO.rows, 'La lista de registros ha sido obtenida con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }

  CONTROLLER.obtener = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ${PK} = req.params.${pk}
      OPTIONS.where = { ${pk}: ${PK} }
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        return app.${MODULE}.dao.${model}._findOne(t, OPTIONS)
      })
      res.success200(RESULTADO, 'La información del registro ha sido obtenida con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.crear = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${MODEL} = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        ${MODEL}._usuario_creacion = ID_USUARIO_SESION
        return app.${MODULE}.dao.${model}.create(t, ${MODEL})
      })
      res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.actualizar = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      const FIELDS = [${attributes}]
      const ${MODEL} = util.obj(req.body, FIELDS)
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        ${MODEL}._usuario_modificacion = ID_USUARIO_SESION
        await app.${MODULE}.dao.${model}.update(t, ${MODEL}, { ${pk}: ${PK} })
      })
      res.success200(RESULTADO, 'El registro ha sido actualizado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.eliminar = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        const ${MODEL} = {}
        ${MODEL}._estado = 'ELIMINADO'
        ${MODEL}._usuario_eliminacion = ID_USUARIO_SESION
        await app.${MODULE}.dao.${model}.destroy(t, ${MODEL},  { ${pk}: ${PK} })
      })
      res.success200(RESULTADO, 'El registro ha sido eliminado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.restaurar = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${PK} = req.params.${pk}
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        const ${MODEL} = {}
        ${MODEL}._estado = 'ACTIVO'
        ${MODEL}._usuario_modificacion = ID_USUARIO_SESION
        ${MODEL}._usuario_eliminacion  = null
        await app.${MODULE}.dao.${model}.restore(t, ${MODEL}, { ${pk}: ${PK} })
      })
      res.success200(RESULTADO, 'El registro ha sido restaurado con éxito.')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [ROUTE] --!> //

  return CONTROLLER
}
`
  return _r
}
