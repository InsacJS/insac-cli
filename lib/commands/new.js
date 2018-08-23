const path = require('path')
const _    = require('lodash')

const cli    = require('../tools/cli')
const util   = require('../tools/util')
const logger = require('../tools/logger')
const config = require('../config/app.config')

module.exports = async function action (appName, options) {
  logger.appTitle('CREANDO PROYECTO')
  options.appName = appName
  await parseArgs(options)

  const APP_NAME = _.kebabCase(_.deburr(options.appName))

  let appTemplatePath = path.resolve(__dirname, '../templates/app')
  let projectPath     = path.resolve(config.PATH.workspace, APP_NAME)
  if (options.force && util.isDir(projectPath)) { cli.rmdir(projectPath) }
  if (util.isDir(projectPath)) {
    throw new Error(`Ya existe el proyecto '${APP_NAME}'.`)
  }
  let packageLinuxSourcePath = path.resolve(__dirname, '../templates/package-linux.json')
  let packageWin32SourcePath = path.resolve(__dirname, '../templates/package-win32.json')
  let readmeSourcePath       = path.resolve(__dirname, '../templates/README.md')
  let gitIgnoreSourcePath    = path.resolve(__dirname, '../templates/gitignore.txt')
  let packageTargetPath      = path.resolve(config.PATH.workspace, `${APP_NAME}/package.json`)
  let readmeTargetPath       = path.resolve(config.PATH.workspace, `${APP_NAME}/README.md`)
  let gitignoreTargetPath    = path.resolve(config.PATH.workspace, `${APP_NAME}/.gitignore`)
  let pack         = require(process.platform === 'win32' ? packageWin32SourcePath : packageLinuxSourcePath)
  let readme       = util.readFile(readmeSourcePath)
  let gitignore    = util.readFile(gitIgnoreSourcePath)
  pack.name        = APP_NAME
  pack.description = options.description
  pack.version     = options.projectVersion
  let readmeContent = `# ${options.appName}\n\n${options.description}\n\n${readme}`

  cli.copyDir(appTemplatePath, projectPath)
  cli.writeFile(packageTargetPath, `${JSON.stringify(pack, null, 2)}\n`)
  cli.writeFile(readmeTargetPath, readmeContent)
  cli.writeFile(gitignoreTargetPath, gitignore)
  try {
    await util.cmd(`yarn --version`, config.PATH.workspace)
    logger.appTitle('INSTALANDO DEPENDENCIAS')
    logger.appInfo('[cmd]', 'yarn install')
    logger.appInfo('', '', await util.cmd(`cd ${APP_NAME} && yarn install`, config.PATH.workspace))
  } catch (e) {
    await util.cmd(`npm --version`, config.PATH.workspace)
    logger.appTitle('INSTALANDO DEPENDENCIAS')
    logger.appInfo('[cmd]', 'npm install')
    logger.appInfo('', '', await util.cmd(`cd ${APP_NAME} && npm install`, config.PATH.workspace))
  }

  try {
    await util.cmd(`git --version`, config.PATH.workspace)
    logger.appTitle('CONFIGURANDO GIT')
    logger.appInfo('[cmd]', 'git init ...')
    logger.appInfo('', '', await util.cmd(`cd ${APP_NAME} && git init`, config.PATH.workspace))
    logger.appInfo('[cmd]', 'git add . ...')
    logger.appInfo('', '', await util.cmd(`cd ${APP_NAME} && git add .`, config.PATH.workspace))
    logger.appInfo('[cmd]', `git commit -m "Commit inicial" ...`)
    logger.appInfo('', '', await util.cmd(`cd ${APP_NAME} && git commit -m "Commit inicial"`, config.PATH.workspace))
  } catch (e) {}

  logger.appSuccess()
  logger.appSuccess(`Proyecto`, APP_NAME, 'creado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  const DESCRIPTION   = `Aplicación back-end creado con el framework Insac JS.`
  options.force       = options.force === true
  options.description = typeof options.description === 'string' ? options.description : DESCRIPTION
}
