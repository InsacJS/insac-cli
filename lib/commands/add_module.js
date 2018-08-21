const path = require('path')
const _    = require('lodash')

const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

const MODULE_FLAG = '// <!-- [CLI] - [MODULE] --!> //'

module.exports = async function action (moduleName, options) {
  options.moduleName = moduleName
  await parseArgs(options)
  logger.appVerbose()
  const MODULE_NAME  = _.toUpper(_.snakeCase(_.deburr(options.moduleName)))
  const MODULES_PATH = path.resolve(config.PATH.sources, `modules`)
  const MODULE_PATH  = path.resolve(MODULES_PATH, MODULE_NAME)

  if (options.force && util.isDir(MODULE_PATH)) { rmdir(MODULE_PATH) }
  if (util.isDir(MODULE_PATH)) {
    console.error()
    console.error(`El módulo '${options.moduleName}' ya existe.\nDirectorio: ${MODULE_PATH}`)
    console.error()
    process.exit(1)
  }

  if (!util.isDir(MODULE_PATH)) { mkdir(MODULE_PATH) }

  let moduleFileSourcePath = path.resolve(__dirname, `../templates/example.module.js`)
  let moduleFileTargetPath = path.resolve(MODULE_PATH, `${options.moduleName}.module.js`)
  let exampleModuleContent = util.readFile(moduleFileSourcePath).replace('MODULE_NAME', MODULE_NAME)
  writeFile(moduleFileTargetPath, exampleModuleContent)

  const APP_PATH    = path.resolve(config.PATH.sources, 'app.js')
  let appContent    = util.readFile(APP_PATH)
  const CAMBIOS_APP = `service.addModule('${MODULE_NAME}')\n${MODULE_FLAG}`
  if (!existLine(appContent, `service.addModule('${MODULE_NAME}')`)) {
    appContent = appContent.replace(MODULE_FLAG, CAMBIOS_APP)
    updateFile(APP_PATH, appContent)
  }

  logger.appInfo()
  logger.appInfo(`Módulo ${MODULE_NAME} creado exitosamente`)
  logger.appVerbose()
}

async function parseArgs (options) {
  options.force       = options.force === true
  options.moduleName = options.moduleName.toLowerCase()
}

function rmdir (dirPath) {
  util.rmdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appVerbose('[carpeta]', `${relativeDirPath} (eliminado) ${logger.OK}`)
}

function mkdir (dirPath) {
  util.mkdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appVerbose('[carpeta]', `${relativeDirPath} ${logger.OK}`)
}

function writeFile (filePath, content) {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} ${logger.OK}`)
}

function updateFile (filePath, content) {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} (modificado) ${logger.OK}`)
}

function existLine (content, str) {
  let result = false
  content.split('\n').forEach(line => { if (line.trim().indexOf(str) !== -1) result = true })
  return result
}
