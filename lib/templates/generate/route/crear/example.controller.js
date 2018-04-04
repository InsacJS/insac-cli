module.exports = (data) => {
  const MODULE  = data.moduleName
  const model   = data.modelName
  const MODEL   = model.toUpperCase()
  const key     = data.key
  let   content = data.fileContent

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ${MODEL} = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        ${MODEL}._usuario_creacion = ID_USUARIO_SESION
        return app.${MODULE}.dao.${model}.create(t, ${MODEL})
      })
      return res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
