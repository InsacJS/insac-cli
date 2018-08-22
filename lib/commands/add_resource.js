const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (resourcePath, options) {
  options.path = resourcePath
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.path}`)

  if (options.force && util.isDir(RESOURCE_PATH)) { cli.rmdir(RESOURCE_PATH) }
  if (util.isDir(RESOURCE_PATH)) {
    console.error(`El recurso '${options.path}' ya existe dentro del módulo '${MODULE_NAME}'.`)
    console.error()
    process.exit(1)
  }

  const FILE_NAME = options.path.split('/').pop()
  util.mkdir(RESOURCE_PATH)
  const addFile = (ext) => {
    const OUTPUT_PATH = path.resolve(RESOURCE_PATH, `${FILE_NAME}${ext}`)
    const INPUT_PATH  = path.resolve(__dirname, `../templates/resources/base/example${ext}`)
    let fileContent   = util.readFile(INPUT_PATH)
    cli.writeFile(OUTPUT_PATH, fileContent)
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
