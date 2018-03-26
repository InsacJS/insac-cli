const Module = require(insac).Module

module.exports = (app, config) => {
  const EXAMPLE = new Module(config)

  return EXAMPLE
}
