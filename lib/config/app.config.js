const path = require('path')
const _    = require('lodash')
const PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()
const CONFIG_PATH = path.resolve(PROJECT_PATH, 'node_modules/insac/lib/config/app.config.js')

const config = loadFile(CONFIG_PATH)

const colors = require('../tools/logger').colors

if (!config.PROJECT) {
  config.PROJECT = {
    cliVersion: '0.0.0'
  }
}

const insacPackageTemplatePath = path.resolve(__dirname, '../templates/package-linux.json')
const insacPackageTemplate     = loadFile(insacPackageTemplatePath)
if (!config.PROJECT.insacVersion) { config.PROJECT.insacVersion = insacPackageTemplate.dependencies.insac }

const cliPackagePath = path.resolve(__dirname, '../../package.json')
const cliPackage     = loadFile(cliPackagePath)
if (cliPackage.version) { config.PROJECT.cliVersion = cliPackage.version }

function loadFile (filePath) {
  try { return require(filePath) } catch (e) { return {} }
}

config.PROJECT.insacVersion2 = `${colors.NOTICE}insac     :${colors.RESET}${colors.ACCENT} ${_.padStart(config.PROJECT.insacVersion, 6, ' ')}${colors.RESET}`
config.PROJECT.cliVersion2   = `${colors.NOTICE}insac-cli :${colors.RESET}${colors.ACCENT} ${_.padStart(config.PROJECT.cliVersion,   6, ' ')}${colors.RESET}`

module.exports = config
