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
    logger.appTitle('INSTALANDO DEPENDENCIAS')
    if (await isYarnInstalled()) { await installWithYarn(APP_NAME) } else { await installWithNPM(APP_NAME) }
  } catch (e) {
    logger.appError()
    logger.appError('Error:', `No se pudo instalar las dependencias, debe instalarlas manualmente.\n`)
  }

  if (await isGitInstalled()) {
    logger.appTitle('CONFIGURANDO GIT')
    try {
      await initializeGit(APP_NAME)
    } catch (e) {
      logger.appError()
      logger.appError('Error:', `No se pudo configurar GIT, debe hacerlo manualmente.\n`)
    }
  }

  logger.appSuccess()
  logger.appSuccess(`Proyecto`, APP_NAME, 'creado exitosamente')
  logger.appSuccess()
}

async function parseArgs (options) {
  const DESCRIPTION   = `Aplicación back-end creado con el framework Insac JS.`
  options.force       = options.force === true
  options.description = typeof options.description === 'string' ? options.description : DESCRIPTION
}

async function isYarnInstalled () {
  try { await util.cmd(`yarn --version`, config.PATH.workspace); return true } catch (e) {}
  return false
}

async function isGitInstalled () {
  try { await util.cmd(`git --version`, config.PATH.workspace); return true } catch (e) {}
  return false
}

async function installWithYarn (APP_NAME) {
  logger.appPrimary('[cmd]', 'yarn install ...\n')
  logger.appPrimary('', '', await util.cmd(`cd ${APP_NAME} && yarn install`, config.PATH.workspace))
}

async function installWithNPM (APP_NAME) {
  logger.appPrimary('[cmd]', 'npm install ...\n')
  logger.appPrimary('', '', await util.cmd(`cd ${APP_NAME} && npm install`, config.PATH.workspace))
}

async function initializeGit (APP_NAME) {
  logger.appPrimary('[cmd]', 'git init ...\n')
  logger.appPrimary('', '', await util.cmd(`cd ${APP_NAME} && git init`, config.PATH.workspace))
  logger.appPrimary('[cmd]', 'git add . ...\n')
  logger.appPrimary('', '', await util.cmd(`cd ${APP_NAME} && git add .`, config.PATH.workspace))
  logger.appPrimary('[cmd]', `git commit -m "Commit inicial" ...\n`)
  logger.appPrimary('', '', await util.cmd(`cd ${APP_NAME} && git commit -m "Commit inicial"`, config.PATH.workspace))
}
