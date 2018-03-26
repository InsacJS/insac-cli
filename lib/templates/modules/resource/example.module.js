const ResourceModule = require(insac).ResourceModule

module.exports = (app, config) => {
  const EXAMPLE = new ResourceModule(config)

  return EXAMPLE
}
