module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName

  const _r = `const { Dao } = require('insac')

module.exports = (app) => {
  const MODEL = app.${MODULE}.models.${model}
  const DAO   = new Dao(MODEL)

  // DAO.findOne         = (t, where, not, include = [], paranoid = true) => {}   : Promise
  // DAO.findAll         = (t, where, not, include = [], paranoid = true) => {}   : Promise
  // DAO.count           = (t, where, not, include = [], paranoid = true) => {}   : Promise
  // DAO.findAndCountAll = (t, where, not, include = [], paranoid = true) => {}   : Promise
  // DAO.create          = (t, data)                                      => {}   : Promise
  // DAO.update          = (t, data, where, not, paranoid = true)         => {}   : Promise
  // DAO.destroy         = (t, data, where, not, paranoid = true)         => {}   : Promise
  // DAO.restore         = (t, data, where, not)                          => {}   : Promise

  return DAO
}
`
  return _r
}
