const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

const COMPONENT_FLAG  = '// <!-- [CLI] - [COMPONENT] --!> //'

module.exports = async function action (key, options) {
  logger.appTitle('ADICIONANDO RUTA')
  options.key = key
  await parseArgs(options)

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = cli.getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.resource}`)

  if (!util.isDir(RESOURCE_PATH)) {
    throw new Error(`No existe el recurso '${options.resource}'.`)
  }

  const MODEL_NAME = options.model || options.resource.split('/').pop()
  const KEY        = options.key
  const addFile = (ext) => {
    const TYPE = ext.replace('.js', '').substr(1).toUpperCase()
    let outputPath = path.resolve(RESOURCE_PATH, `${MODEL_NAME}${ext}`)
    util.find(RESOURCE_PATH, ext, ({ filePath }) => { outputPath = filePath })
    let fileContent = require(path.resolve(__dirname, `../templates/resources/base/example${ext}`))()
    if (util.isFile(outputPath)) {
      fileContent = util.readFile(outputPath)
      if (cli.existLine(fileContent, `${TYPE}.${KEY} = {`) && !options.force) {
        throw new Error(`Ya existe la ruta '${TYPE}.${KEY}'.`)
      }
    }
    const data = {
      key         : KEY,
      moduleName  : MODULE_NAME,
      path        : options.path,
      method      : options.method,
      description : options.description,
      version     : options.routeVersion,
      model       : options.model
    }
    let routeContent = require(path.resolve(__dirname, `../templates/route/example/example${ext}`))(data)
    fileContent = fileContent.replace(COMPONENT_FLAG, routeContent)
    fileContent = fileContent.replace(`// const { Field } = require('insac')`, `const { Field } = require('insac')`)
    cli.updateFile(outputPath, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')

  logger.appSuccess()
  logger.appSuccess(`Ruta`, options.key, 'adicionada exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  if (!options.resource) {
    throw new Error(`Se requiere la opción --resource`)
  }
  options.force       = options.force === true
  options.description = typeof options.description === 'string' ? options.description : ''
  options.path        = options.path !== '<resource>/<key>' ? options.path : `/${options.resource}/${options.key}`
  let vMatch  = options.path.match(/\/v(\d)*\//i)
  options.routeVersion = typeof options.routeVersion === 'string' ? parseInt(options.routeVersion) : (vMatch ? parseInt(vMatch[0].substr(2, vMatch[0].length - 3)) : 1)

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
