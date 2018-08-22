const path = require('path')

const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

const COMPONENT_FLAG  = '// <!-- [CLI] - [COMPONENT] --!> //'

module.exports = async function action (key, options) {
  options.key = key
  await parseArgs(options)
  logger.appVerbose()

  const MODULE_NAME    = options.module.toUpperCase()
  const MODULE_DIRNAME = getModuleDirName(options.module)
  const RESOURCE_PATH  = path.resolve(config.PATH.sources, `modules/${MODULE_DIRNAME}/resources/${options.resource}`)

  if (!util.isDir(RESOURCE_PATH)) {
    console.error(`No existe el recurso '${options.resource}' dentro del módulo '${MODULE_NAME}'`)
    process.exit(1)
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
      if (existLine(fileContent, `${TYPE}.${KEY} = {`) && !options.force) {
        console.error(`Ya existe la ruta '${TYPE}.${KEY}'. Archivo: ${outputPath}`)
        process.exit(1)
      }
    }
    const data = {
      key         : KEY,
      moduleName  : MODULE_NAME,
      path        : options.path,
      method      : options.type,
      description : options.description,
      version     : options.version,
      model       : options.model
    }
    let routeContent = require(path.resolve(__dirname, `../templates/route/example/example${ext}`))(data)
    fileContent = fileContent.replace(COMPONENT_FLAG, routeContent)
    fileContent = fileContent.replace(`// const { Field } = require('insac')`, `const { Field } = require('insac')`)
    updateFile(outputPath, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')

  logger.appInfo()
  logger.appInfo(`Ruta ${options.key} adicionada exitosamente`)
  logger.appInfo()
}

async function parseArgs (options) {
  options.force       = options.force === true
  options.description = typeof options.description === 'string' ? options.description : ''
  options.path        = options.path !== '<resource>/<key>' ? options.path : `/${options.resource}/${options.key}`
  let vMatch  = options.path.match(/\/v(\d)*\//i)
  options.version = typeof options.version === 'string' ? parseInt(options.version) : (vMatch ? parseInt(vMatch[0].substr(2, vMatch[0].length - 3)) : 1)

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

function existLine (content, str) {
  let result = false
  content.split('\n').forEach(line => { if (line.trim().indexOf(str) !== -1) result = true })
  return result
}

function updateFile (filePath, content) {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appVerbose('[archivo]', `${relativeDirPath} (modificado) ${logger.OK}`)
}
