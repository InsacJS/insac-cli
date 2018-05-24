module.exports = (app) => {
  const UTIL = {}

  UTIL.log = (obj) => {
    console.log(require('util').inspect(obj, { depth: null }))
  }

  return UTIL
}
