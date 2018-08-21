const LOGGER = {
  // Hablita los colores de los logs.
  colors: true,

  console: {
    timestamp : true, // Muestra el timestamp
    reqId     : true, // Muestra el id de la petición
    transport : {
      level: 'info' // Nivel de detalle
    }
  },

  file: {
    // fatal: 0, error: 1, warn: 2, notice: 3, info: 4, verbose: 5, debug: 6, silly: 7
    levels    : ['fatal', 'error', 'info'],
    transport : {
      maxsize  : 5242880, // Tamaño máximo de los archivos expresado en Bytes.
      maxFiles : 5        // Cantidad máxima de archivos.
    }
  },

  // Habilita los datos de entrada y salida que serán registrados.
  include: {
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
