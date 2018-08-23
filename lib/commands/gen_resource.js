const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (resourceName, options) {
  logger.appTitle('GENERANDO RECURSO')
  options.resourceName = resourceName
  await parseArgs(options)

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.resourceName}`)

  if (options.force && util.isDir(RESOURCE_PATH)) { cli.rmdir(RESOURCE_PATH) }
  if (util.isDir(RESOURCE_PATH)) {
    throw new Error(`Ya existe el recurso '${options.resourceName}'.`)
  }

  const SERVICE = await cli.getService()
  const MODEL = SERVICE.app[MODULE_NAME].models[options.model]

  if (!MODEL) {
    throw new Error(`No existe el modelo '${options.model}'.`)
  }

  cli.mkdir(RESOURCE_PATH)

  const data = {
    moduleName : MODULE_NAME,
    modelName  : options.model,
    model      : MODEL
  }

  data.GROUP      = options.resourceName
  data.LEVEL      = options.level
  data.ROUTE_TYPE = options.type
  data.VERSION    = options.resourceVersion
  function addFile (ext) {
    const FILE_NAME = options.resourceName.split('/').pop()
    const OUTPUT_PATH = path.resolve(RESOURCE_PATH, `${FILE_NAME}${ext}`)
    const INPUT_PATH  = path.resolve(__dirname, `../templates/generate/resource/basic/example${ext}`)
    let fileContent = require(INPUT_PATH)(data)
    cli.writeFile(OUTPUT_PATH, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')

  await SERVICE.close()

  logger.appSuccess()
  logger.appSuccess(`Recurso`, options.resourceName, 'generado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  if (!options.model) {
    throw new Error(`Se requiere la opción --model`)
  }
  options.force = options.force === true
  options.model = typeof options.model === 'string' ? options.model.toLowerCase() : undefined
  if (!options.module) {
    if (config.modules.length !== 1) {
      throw new Error(`Se requiere el nombre del módulo.`)
    }
    options.module = config.modules[0].fileName
  } else {
    if (!util.toArray(config.modules, 'fileName').includes(options.module)) {
      throw new Error(`No existe el módulo '${options.module}'.`)
    }
  }
  let vMatch  = options.resourceName.match(/\/v(\d)*\//i)
  options.resourceVersion = typeof options.resourceVersion === 'string' ? parseInt(options.resourceVersion) : (vMatch ? parseInt(vMatch[0].substr(2, vMatch[0].length - 3)) : 1)
  options.level           = parseInt(options.level)
  options.type            = (!options.type || options.type === 'all') ? 'get,getId,create,update,destroy,restore' : options.type
}
