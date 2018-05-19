const path = require('path')

exports.PATH = {
  modules : path.resolve(__dirname, 'src/modules'),
  config  : path.resolve(__dirname, 'src/config'),
  hooks   : path.resolve(__dirname, 'src/hooks')
}
