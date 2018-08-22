const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (modelName, options) {
  options.modelName = modelName
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const SEED_PATH      = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/seeders/${options.modelName}.seed.js`)

  if (options.force && util.isFile(SEED_PATH)) { cli.removeFile(SEED_PATH) }
  if (util.isFile(SEED_PATH)) {
    console.error()
    console.error(`El seed '${options.modelName}' ya existe.\nArchivo: ${SEED_PATH}`)
    console.error()
    process.exit(1)
  }

  const SERVICE = await cli.getService()
  if (!SERVICE.app[MODULE_NAME].models[options.modelName]) {
    console.error(`No existe el modelo '${options.modelName}' dentro del módulo '${MODULE_NAME}'`)
    console.error()
    process.exit(1)
  }

  const data = { moduleName: MODULE_NAME, modelName: options.modelName, app: SERVICE.app, count: options.records }
  let seedContent = require(path.resolve(__dirname, '../templates/example.seed.js'))(data)

  cli.writeFile(SEED_PATH, seedContent)
  await SERVICE.close()

  logger.appInfo()
  logger.appInfo(`Seed ${options.modelName} adicionado exitosamente`)
  logger.appVerbose()
}

async function parseArgs (options) {
  options.force     = options.force   === true
  options.example   = options.example === true
  options.records   = parseInt(options.records)
  options.modelName = options.modelName.toLowerCase()
  if (!options.module) {
    if (config.modules.length !== 1) {
      console.error('Se requiere el nombre del módulo.')
      process.exit(1)
    }
    options.module = config.modules[0].fileName
  } else {
    if (!util.toArray(config.modules, 'fileName').includes(options.module)) {
      console.error(`No existe el módulo '${options.module}'`)
      process.exit(1)
    }
  }
}
