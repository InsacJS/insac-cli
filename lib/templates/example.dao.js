module.exports = (data) => {
  const MODULE = data.moduleName
  const model  = data.modelName

  const _r = `const Dao = require(insac).Dao

module.exports = (app) => {
  const MODEL = app.${MODULE}.models.${model}
  const DAO   = new Dao(MODEL)

  // DAO.findOne         = (t, where, not, include = [], paranoid = true) => {}
  // DAO.findAll         = (t, where, not, include = [], paranoid = true) => {}
  // DAO.count           = (t, where, not, include = [], paranoid = true) => {}
  // DAO.findAndCountAll = (t, where, not, include = [], paranoid = true) => {}
  // DAO.create          = (t, data)                                      => {}
  // DAO.update          = (t, data, where, not, paranoid = true)         => {}
  // DAO.destroy         = (t, data, where, not, paranoid = true)         => {}
  // DAO.restore         = (t, data, where, not)                          => {}

  return DAO
}
`
  return _r
}
