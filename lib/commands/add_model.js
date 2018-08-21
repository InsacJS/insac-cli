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
  const MODEL_PATH     = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/models/${options.modelName}.model.js`)
  const DAO_PATH       = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/dao/${options.modelName}.dao.js`)
  const FIELDS         = options.fields ? options.fields.split(',') : []

  if (options.force) {
    if (util.isFile(MODEL_PATH)) { removeFile(MODEL_PATH) }
    if (util.isFile(DAO_PATH))   { removeFile(DAO_PATH) }
  }
  if (util.isFile(MODEL_PATH)) {
    console.error(`El modelo ${options.modelName} ya existe.`)
    console.error()
    process.exit(1)
  }
  if (util.isFile(DAO_PATH)) {
    console.error(`El dao ${options.modelName} ya existe.`)
    console.error()
    process.exit(1)
  }

  const data = { moduleName: MODULE_NAME, modelName: options.modelName, fields: FIELDS, example: options.example }
  let modelContent = require(path.resolve(__dirname, '../templates/example.model.js'))(data)
  let daoContent   = require(path.resolve(__dirname, '../templates/example.dao.js'))(data)

  writeFile(MODEL_PATH, modelContent)
  if (!util.isFile(DAO_PATH)) { writeFile(DAO_PATH, daoContent) }

  logger.appInfo()
  logger.appInfo(`Modelo ${options.modelName} creado exitosamente`)
  logger.appVerbose()
}

async function parseArgs (options) {
  options.force     = options.force   === true
  options.example   = options.example === true
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
