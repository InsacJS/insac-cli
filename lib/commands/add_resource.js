const path = require('path')

const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (resourcePath, options) {
  options.path = resourcePath
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.path}`)

  if (options.force && util.isDir(RESOURCE_PATH)) { rmdir(RESOURCE_PATH) }
  if (util.isDir(RESOURCE_PATH)) {
    console.error(`El recurso '${options.path}' ya existe dentro del módulo '${MODULE_NAME}'.`)
    console.error()
    process.exit(1)
  }

  const MODEL_NAME = options.model || options.path.split('/').pop()
  util.mkdir(RESOURCE_PATH)
  const addFile = (ext) => {
    const OUTPUT_PATH = path.resolve(RESOURCE_PATH, `${MODEL_NAME}${ext}`)
    const INPUT_PATH  = path.resolve(__dirname, `../templates/resources/base/example${ext}`)
    let fileContent   = util.readFile(INPUT_PATH)
    writeFile(OUTPUT_PATH, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')

  logger.appInfo()
  logger.appInfo(`Recurso ${options.path} adicionado exitosamente`)
  logger.appInfo()
}

async function parseArgs (options) {
  options.force = options.force === true
  options.model = typeof options.model === 'string' ? options.model.toLowerCase() : undefined
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

function rmdir (dirPath) {
  util.rmdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appVerbose('[carpeta]', `${relativeDirPath} (eliminado) ${logger.OK}`)
}

function writeFile (filePath, content) {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} ${logger.OK}`)
}
