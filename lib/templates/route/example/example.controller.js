module.exports = (data) => {
  const key = data.key

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      const RESULT = await app.DB.sequelize.transaction(async (t) => {
        // TODO
        return
      })
      return res.success200(RESULT, 'ok')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return _r
}
