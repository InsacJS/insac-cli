CONTROLLER.{{routeKey}} = async (req, res, next) => {
  try {
    // TODO
    // const OPTIONS = req.options
    // const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
    //   return app.CENTRAL.dao.curso._findAndCountAll(t, OPTIONS)
    // })
    // res.success200(RESULTADO.rows, 'La lista de registros ha sido obtenida con éxito.', { count: RESULTADO.count })
    res.success200('ok')
  } catch (err) { next(err) }
}
