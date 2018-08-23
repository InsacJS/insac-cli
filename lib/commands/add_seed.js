const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (modelName, options) {
  logger.appTitle('ADICIONANDO SEED')
  options.modelName = modelName
  await parseArgs(options)

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const SEED_PATH      = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/seeders/${options.modelName}.seed.js`)

  if (options.force && util.isFile(SEED_PATH)) { cli.removeFile(SEED_PATH) }
  if (util.isFile(SEED_PATH)) {
    throw new Error(`Ya existe el seed '${options.modelName}'.`)
  }

  const SERVICE = await cli.getService()
  if (!SERVICE.app[MODULE_NAME].models[options.modelName]) {
    throw new Error(`No existe el modelo '${options.modelName}'.`)
  }

  const data = { moduleName: MODULE_NAME, modelName: options.modelName, app: SERVICE.app, count: options.records }
  let seedContent = require(path.resolve(__dirname, '../templates/example.seed.js'))(data)

  cli.writeFile(SEED_PATH, seedContent)
  await SERVICE.close()

  logger.appSuccess()
  logger.appSuccess(`Seed`, options.modelName, 'adicionado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  options.force     = options.force   === true
  options.example   = options.example === true
  options.records   = parseInt(options.records)
  options.modelName = options.modelName.toLowerCase()
  if (!options.module) {
    if (config.modules.length !== 1) {
      throw new Error(`Se requiere el nombre del módulo.`)
    }
    options.module = config.modules[0].fileName
  } else {
    if (!util.toArray(config.modules, 'fileName').includes(options.module)) {
      throw new Error(`No existe el módulo '${options.module}'`)
    }
  }
}
