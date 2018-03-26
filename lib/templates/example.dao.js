const Dao = require(insac).Dao

module.exports = (app) => {
  const MODEL = app.{{moduleName}}.models.{{resourceName}}
  const DAO   = new Dao(MODEL)

  // findOne(t, where, not, paranoid = true, include = [])
  // findAll(t, where, not, paranoid = true, include = [])
  // count(t, where, not, paranoid = true, include = [])
  // findAndCountAll(t, where, not, paranoid = true, include = [])
  // create(t, data),
  // update(t, data, where, not, paranoid = true)
  // destroy(t, data, where, not, paranoid = true)
  // restore(t, data, where, not)

  // TODO

  return DAO
}
