module.exports = (data) => {
  const key = data.key

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      // TODO
      res.success200('ok')
    } catch (err) { next(err) }
  }

  // <!-- [CLI] - [ROUTE] --!> //`
  return _r
}
