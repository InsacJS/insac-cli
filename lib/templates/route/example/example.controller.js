module.exports = (data) => {
  const key = data.key

  const _r = `CONTROLLER.${key} = async (req, res, next) => {
    try {
      // TODO
      return res.success200('ok')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return _r
}
