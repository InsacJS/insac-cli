const SERVER = {
  start  : true,             // Habilita la carga de los componentes del servidor
  listen : true,             // Habilita el listen del servidor cuando se ejecuta la aplicación

  protocol : 'http',         // Valor asignado automáticamente según la propiedad 'SERVER.https'
  hostname : 'localhost',
  port     : 4000,
  env      : 'development',

  // https://github.com/expressjs/cors#configuration-options
  cors        : true,
  corsOptions : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },

  // https://helmetjs.github.io/docs/
  helmet        : true,
  helmetOptions : {},

  // https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
  https        : false,
  httpsOptions : {}
}

module.exports = SERVER
