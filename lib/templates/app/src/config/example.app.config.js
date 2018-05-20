const fs   = require('fs')
const path = require('path')

// |=============================================================|
// |------------ CONFIGURACIÓN PARA LA BASE DE DATOS ------------|
// |=============================================================|

exports.DATABASE = {
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || '_example',
  params   : {
    dialect : 'postgres',
    host    : process.env.DB_HOST_NAME || '127.0.0.1',
    port    : process.env.DB_HOST_PORT || '5432'
  }
}

// |=============================================================|
// |------------ CONFIGURACIÓN PARA EL SERVIDOR -----------------|
// |=============================================================|

exports.SERVER = {
  port : process.env.PORT     || 4000,
  env  : process.env.NODE_ENV || 'development',
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  ssl: {
    key  : fs.readFileSync(path.resolve(process.cwd(), 'certs/privateKey.pem')),
    cert : fs.readFileSync(path.resolve(process.cwd(), 'certs/publicKey.pem'))
  },
  https: false
}

// |=============================================================|
// |------------ CONFIGURACIÓN PARA LOS MÓDULOS -----------------|
// |=============================================================|

// <!-- [CLI] - [CONFIG] --!> //
