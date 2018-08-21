const path = require('path')
const _    = require('lodash')

const util = require('../tools/util')

module.exports = async function action (appName, options) {
  options.appName = appName
  await parseArgs(options)
  console.log('AppName     : ', appName)
  console.log('Descripción : ', options.description)
  console.log('Versión     : ', options.version)
  console.log('Force       : ', options.force)

  const APP_NAME        = _.kebabCase(_.deburr(options.appName))
  // const APP_DESCRIPTION = options.description
  const FORCE           = options.force

  let appTemplatePath   = path.resolve(__dirname, './templates/app')
  let projectPath       = path.resolve(process.cwd(), APP_NAME)
  if (util.isDir(projectPath) && !FORCE) {
    console.error()
    console.error(`El proyecto '${options.appName}' ya existe.\nDirectorio: ${projectPath}`)
    console.error()
    process.exit(1)
  }
  util.copyDir(appTemplatePath, projectPath)
}

async function parseArgs (options) {
  options.force       = options.force === true
  options.description = typeof options.description === 'string' ? options.description : ''
}

/**

try {
  if (!app) { throwError(`Se requiere el nombre de la aplicación.`) }
  const APP_NAME        = _.kebabCase(_.deburr(app))
  const APP_DESCRIPTION = description
  const FORCE           = program.force || false
  let source            = path.resolve(__dirname, './templates/app')
  let projectPath       = path.resolve(process.cwd(), APP_NAME)
  if (util.isDir(projectPath) && !FORCE) {
    throwError(`El directorio ya existe.\nDirectorio: ${projectPath}`)
  }
  let packageLinuxSourcePath = path.resolve(__dirname, './templates/package-linux.json')
  let packageWin32SourcePath = path.resolve(__dirname, './templates/package-win32.json')
  let packageLockSourcePath  = path.resolve(__dirname, './templates/packagelock.json')
  let yarnLockSourcePath     = path.resolve(__dirname, './templates/yarn.lock')
  let readmeSourcePath       = path.resolve(__dirname, './templates/README.md')
  let gitIgnoreSourcePath    = path.resolve(__dirname, './templates/gitignore.txt')
  let packageTargetPath      = path.resolve(process.cwd(), `./${APP_NAME}/package.json`)
  let packageLockTargetPath  = path.resolve(process.cwd(), `./${APP_NAME}/package-lock.json`)
  let yarnLockTargetPath     = path.resolve(process.cwd(), `./${APP_NAME}/yarn.lock`)
  let readmeTargetPath       = path.resolve(process.cwd(), `./${APP_NAME}/README.md`)
  let gitignoreTargetPath    = path.resolve(process.cwd(), `./${APP_NAME}/.gitignore`)
  let pack         = require(process.platform === 'win32' ? packageWin32SourcePath : packageLinuxSourcePath)
  let packLock     = require(packageLockSourcePath)
  let yarnLock     = util.readFile(yarnLockSourcePath)
  let readme       = util.readFile(readmeSourcePath)
  let gitignore    = util.readFile(gitIgnoreSourcePath)
  pack.name        = APP_NAME
  pack.description = APP_DESCRIPTION
  packLock.name    = APP_NAME
  util.copyDir(source, projectPath)
  let readmeContent = `# ${APP_NAME}\n\n${APP_DESCRIPTION ? `${APP_DESCRIPTION}\n\n` : ''}${readme}`
  util.writeFile(packageTargetPath, `${JSON.stringify(pack, null, 2)}\n`)
  util.writeFile(packageLockTargetPath, `${JSON.stringify(packLock, null, 2)}\n`)
  util.writeFile(yarnLockTargetPath, yarnLock)
  util.writeFile(readmeTargetPath, readmeContent)
  util.writeFile(gitignoreTargetPath, gitignore)
  try {
    process.stdout.write('\n - Instalando dependencias con YARN ...\n')
    process.stdout.write('\n' + await util.cmd(`cd ${APP_NAME} && yarn install`, process.cwd()) + '\n')
  } catch (e) {
    try {
      process.stdout.write('\n - Falló la instalación con YARN, instalando con NPM ...\n')
      process.stdout.write('\n' + await util.cmd(`cd ${APP_NAME} && npm install`, process.cwd()))
    } catch (e) { }
  }
  try { process.stdout.write(await util.cmd('git init', projectPath)) } catch (e) {}
  process.stdout.write(`\x1b[32m\n Proyecto \x1b[0m${APP_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  process.exit(0)
} catch (err) { throwError('Hubo un error inesperado', err) }

*/
