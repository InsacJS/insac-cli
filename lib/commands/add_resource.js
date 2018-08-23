const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (resourcePath, options) {
  logger.appTitle('ADICIONANDO RECURSO')
  options.path = resourcePath
  await parseArgs(options)

  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.path}`)

  if (options.force && util.isDir(RESOURCE_PATH)) { cli.rmdir(RESOURCE_PATH) }
  if (util.isDir(RESOURCE_PATH)) {
    throw new Error(`Ya existe el recurso '${options.path}'.`)
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

  logger.appSuccess()
  logger.appSuccess(`Recurso`, options.path, 'adicionado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  options.force = options.force === true
  if (!options.module) {
    if (config.modules.length !== 1) {
      throw new Error(`Se requiere el nombre del módulo.`)
    }
    options.module = config.modules[0].fileName
  } else {
    if (!util.toArray(config.modules, 'fileName').includes(options.module)) {
      throw new Error(`No existe el módulo '${options.module}'\n`)
    }
  }
}
