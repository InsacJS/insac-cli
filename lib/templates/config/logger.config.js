const LOGGER = {
  enabled : true, // Habilita los logs
  colors  : true, // Hablita los colores de los logs

  console: {
    timestamp : true, // Muestra el timestamp
    reqId     : true, // Muestra el id de la petición
    transport : {
      level : 'info', // Nivel de detalle
      json  : false
    }
  },

  file: {
    // fatal: 0, error: 1, warn: 2, notice: 3, info: 4, verbose: 5, debug: 6, silly: 7
    levels    : ['error', 'warn', 'info'],
    transport : {
      json     : true,
      maxsize  : 5242880,
      maxFiles : 5
    }
  },

  // Habilita el registro de los datos de entrada y salida
  include: {
    request: {
      path: true
    },

    response: {
      success  : true,
      error    : true,
      error500 : true
    },

    input: {
      headers : false,
      params  : true,
      query   : true,
      body    : true
    },

    output: {
      data: false
    }
  }
}

module.exports = LOGGER
