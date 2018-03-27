CONTROLLER.{{key}} = async (req, res, next) => {
    try {
      res.success200('ok')
    } catch (err) { next(err) }
  }
