const path = require('path')

exports.PATH = {
  modules : path.resolve(__dirname, 'src/modules'),
  config  : path.resolve(__dirname, 'src/config'),
  hooks   : path.resolve(__dirname, 'src/hooks'),
  logs    : path.resolve(__dirname, 'logs')
}

exports.APIDOC = {
  title    : 'Apidoc',
  name     : 'Documentación'
}

exports.LOGGER = {
  console: {
    timestamp : true,
    reqId     : true
  },
  file: {
    maxsize  : 5242880,
    maxFiles : 5,
    levels   : ['error', 'warn']
  }
}
