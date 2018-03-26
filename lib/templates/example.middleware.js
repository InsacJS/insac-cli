MIDDLEWARE.{{routeKey}} = [
  async (req, res, next) => {
    try {
      // TODO
      // const USERNAME = req.body.username
      // if (await app.AUTH.dao.usuario.findOne(null, { username: USERNAME }, null, false)) {
      //   throw new Conflict('El nombre de usuario ya se encuentra registrado.')
      // }
      next()
    } catch (err) { next(err) }
  }
]
