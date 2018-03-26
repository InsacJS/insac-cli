const ServiceModule = require(insac).ServiceModule

module.exports = (app, config) => {
  const EXAMPLE = new ServiceModule(config)

  return EXAMPLE
}
