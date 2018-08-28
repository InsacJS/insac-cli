const RESPONSE = {
  all200: false, // Fuerza el envío de una respuesta exitosa para todas las peticiones

  successFormat: (result) => {
    const RESULT = {
      status  : result.status,
      code    : result.code,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  },

  errorFormat: (result) => {
    result.errors.forEach(err => {
      if (process.env.NODE_ENV === 'production' || !err.dev) delete err.dev
    })
    return {
      status  : result.status,
      code    : result.code,
      message : result.message,
      errors  : result.errors
    }
  }
}

module.exports = RESPONSE
