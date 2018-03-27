const ServiceModule = require(insac).ServiceModule

module.exports = (app, config) => {
  const {{moduleName}} = new ServiceModule(config)

  return {{moduleName}}
}
