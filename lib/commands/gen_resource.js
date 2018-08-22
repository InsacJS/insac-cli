const path = require('path')

const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (resourceName, options) {
  options.resourceName = resourceName
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.resourceName}`)

  if (options.force && util.isDir(RESOURCE_PATH)) { rmdir(RESOURCE_PATH) }
  if (util.isDir(RESOURCE_PATH)) {
    console.error(`El recurso '${options.path}' ya existe dentro del módulo '${MODULE_NAME}'.`)
    console.error()
    process.exit(1)
  }

  const SERVICE = await getService()
  const MODEL = SERVICE.app[MODULE_NAME].models[options.model]

  if (!MODEL) {
    console.error(`No existe el modelo '${options.model}' dentro del módulo '${MODULE_NAME}'`)
    console.error()
    process.exit(1)
  }

  mkdir(RESOURCE_PATH)

  const data = {
    moduleName : MODULE_NAME,
    modelName  : options.model,
    model      : MODEL
  }

  data.GROUP      = options.resourceName
  data.LEVEL      = options.level
  data.ROUTE_TYPE = options.type
  data.VERSION    = options.version
  function addFile (ext) {
    const OUTPUT_PATH = path.resolve(RESOURCE_PATH, `${options.model}${ext}`)
    const INPUT_PATH  = path.resolve(__dirname, `../templates/generate/resource/basic/example${ext}`)
    let fileContent = require(INPUT_PATH)(data)
    util.writeFile(OUTPUT_PATH, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')

  await SERVICE.close()

  logger.appInfo()
  logger.appInfo(`Recurso ${options.resourceName} generado exitosamente`)
  logger.appInfo()
}

async function parseArgs (options) {
  if (!options.model) {
    console.log()
    console.log('  Se requiere la opción --model')
    console.log()
    process.exit(1)
  }
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
  let vMatch  = options.resourceName.match(/\/v(\d)*\//i)
  options.version = typeof options.version === 'string' ? parseInt(options.version) : (vMatch ? parseInt(vMatch[0].substr(2, vMatch[0].length - 3)) : 1)
  options.level   = parseInt(options.level)
  options.type    = (!options.type || options.type === 'all') ? 'get,getId,create,update,destroy,restore' : options.type
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

function mkdir (dirPath) {
  util.mkdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appVerbose('[carpeta]', `${relativeDirPath} ${logger.OK}`)
}
