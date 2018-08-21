const SERVER = {
  protocol : process.env.PROTOCOL || 'http',
  hostname : process.env.HOSTNAME || 'localhost',
  port     : process.env.PORT     || 4000,
  env      : process.env.NODE_ENV || 'development',

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
  helmetOptions : {}
}

module.exports = SERVER
