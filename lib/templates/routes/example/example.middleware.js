MIDDLEWARE.{{key}} = [
    async (req, res, next) => {
      try {
        // TODO
        next()
      } catch (err) { next(err) }
    }
  ]
