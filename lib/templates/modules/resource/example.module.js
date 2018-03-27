const ResourceModule = require(insac).ResourceModule

module.exports = (app, config) => {
  const {{moduleName}} = new ResourceModule(config)

  return {{moduleName}}
}
