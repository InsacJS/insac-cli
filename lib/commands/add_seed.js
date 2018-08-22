const path = require('path')

const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (modelName, options) {
  options.modelName = modelName
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = getModuleDirName(options.module)
  const SEED_PATH      = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/seeders/${options.modelName}.seed.js`)

  if (options.force && util.isFile(SEED_PATH)) { removeFile(SEED_PATH) }
  if (util.isFile(SEED_PATH)) {
    console.error()
    console.error(`El archivo '${options.moduleName}.seed.js' ya existe.\nArchivo: ${SEED_PATH}`)
    console.error()
    process.exit(1)
  }

  const SERVICE = await getService()
  if (!SERVICE.app[MODULE_NAME].models[options.modelName]) {
    console.error(`No existe el modelo '${options.modelName}' dentro del módulo '${MODULE_NAME}'`)
    console.error()
    process.exit(1)
  }

  const data = { moduleName: MODULE_NAME, modelName: options.modelName, app: SERVICE.app, count: options.records }
  let seedContent = require(path.resolve(__dirname, '../templates/example.seed.js'))(data)

  writeFile(SEED_PATH, seedContent)
  await SERVICE.close()

  logger.appInfo()
  logger.appInfo(`Modelo ${options.modelName} creado exitosamente`)
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

function getModuleDirName (moduleName) {
  for (let i in config.modules) {
    if (config.modules[i].fileName === moduleName) { return config.modules[i].dirName }
  }
}

function writeFile (filePath, content) {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} ${logger.OK}`)
}

function removeFile (filePath) {
  util.removeFile(filePath)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} (eliminado) ${logger.OK}`)
}

function getService () {
  return new Promise((resolve, reject) => {
    process.env.LOGGER = 'false'
    const service = require(process.cwd())
    const retry = async (cnt) => {
      if (!service.app.loaded) {
        if (cnt > 10) { return reject(new Error('Hubo un error al cargar la aplicación.')) }
        await util.timer(500)
        return retry(cnt++)
      }
      return resolve(service)
    }
    return retry(1)
  })
}
