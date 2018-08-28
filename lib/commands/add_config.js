const path = require('path')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (type, options) {
  logger.appTitle('ADICIONANDO ARCHIVO DE CONFIGURACIÓN')
  options.type = type
  await parseArgs(options)

  let CONFIG_PATH
  let TEMPLATE_PATH

  if (['database', 'server', 'logger', 'response', 'apidoc'].includes(options.type)) {
    CONFIG_PATH   = path.resolve(config.PATH.sources, `config/${options.type}.config.js`)
    TEMPLATE_PATH = path.resolve(__dirname, `../templates/config/${options.type}.config.js`)
  }
  if (options.type === 'ecosystem') {
    CONFIG_PATH   = path.resolve(config.PATH.project, `ecosystem.config.json`)
    TEMPLATE_PATH = path.resolve(__dirname, `../templates/ecosystem.config.json`)
  }

  if (!['database', 'server', 'logger', 'response', 'apidoc', 'ecosystem'].includes(options.type)) {
    let existModule = false
    config.modules.forEach(mod => {
      if (mod.fileName === options.type) {
        CONFIG_PATH   = path.resolve(mod.dirPath, `config/${options.type}.config.js`)
        TEMPLATE_PATH = path.resolve(__dirname, '../templates/example.config.js')
        existModule = true
      }
    })
    if (!existModule) {
      throw new Error(`No existe el módulo '${options.type}'`)
    }
  }

  const CONFIG_NAME = CONFIG_PATH.split(path.sep).pop()

  if (options.force) {
    if (util.isFile(CONFIG_PATH))              { cli.removeFile(CONFIG_PATH) }
    if (util.isFile(`${CONFIG_PATH}.example`)) { cli.removeFile(`${CONFIG_PATH}.example`) }
  }

  if (util.isFile(CONFIG_PATH)) {
    throw new Error(`Ya existe el archivo '${CONFIG_NAME}'.`)
  }

  let configContent = util.readFile(TEMPLATE_PATH)
  configContent = configContent.replace(/MODULE_NAME/g, options.type.toUpperCase())

  cli.writeFile(CONFIG_PATH, configContent)
  cli.writeFile(`${CONFIG_PATH}.example`, configContent)

  logger.appSuccess()
  logger.appSuccess(`Archivo`, CONFIG_NAME, 'adicionado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  options.type  = options.type.toLowerCase()
  options.force = options.force === true
}
