module.exports = (data) => {
  const key = data.key

  const _r = `MIDDLEWARE.${key} = [
    async (req, res, next) => {
      try {
        // TODO
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [ROUTE] --!> //`
  return _r
}
