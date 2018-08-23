const path = require('path')
const _    = require('lodash')

const util = require('../tools/util')

const PROJECT_PATH   = process.env.PROJECT_PATH   || process.cwd()
const WORKSPACE_PATH = process.env.WORKSPACE_PATH || process.cwd()
const CONFIG_PATH    = path.resolve(PROJECT_PATH, 'node_modules/insac/lib/config/app.config.js')

const config = loadFile(CONFIG_PATH)

if (!config.PATH)    { config.PATH    = {} }
if (!config.PROJECT) { config.PROJECT = {} }
config.PATH.workspace     = WORKSPACE_PATH
config.PROJECT.cliVersion = '0.0.0'

config.modules = []
if (config.PATH.sources) {
  const MODULES_PATH = path.resolve(config.PATH.sources, 'modules')
  if (util.isDir(MODULES_PATH)) {
    config.modules = util.find(MODULES_PATH, `.module.js`)
  }
}

const colors = require('../tools/logger').colors

const insacPackageTemplatePath = path.resolve(__dirname, '../templates/package-linux.json')
const insacPackageTemplate     = loadFile(insacPackageTemplatePath)
if (!config.PROJECT.insacVersion) { config.PROJECT.insacVersion = insacPackageTemplate.dependencies.insac }

const cliPackagePath = path.resolve(__dirname, '../../package.json')
const cliPackage     = loadFile(cliPackagePath)
if (cliPackage.version) { config.PROJECT.cliVersion = cliPackage.version }

function loadFile (filePath) {
  try { return require(filePath) } catch (e) { return {} }
}

config.PROJECT.insacVersion2 = `${colors.PRIMARY}insac     :${colors.RESET}${colors.TEXT} ${_.padStart(config.PROJECT.insacVersion, 6, ' ')}${colors.RESET}`
config.PROJECT.cliVersion2   = `${colors.PRIMARY}insac-cli :${colors.RESET}${colors.TEXT} ${_.padStart(config.PROJECT.cliVersion,   6, ' ')}${colors.RESET}`

module.exports = config
