const { Module } = require('insac')

module.exports = (app) => {
  const CONFIG = app.config.UTIL

  return new Module(CONFIG)
}
