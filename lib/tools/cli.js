const config = require('../config/app.config')
const util   = require('../tools/util')
const logger = require('../tools/logger')

module.exports.getModuleDirName = (moduleName) => {
  for (let i in config.modules) {
    if (config.modules[i].fileName === moduleName) { return config.modules[i].dirName }
  }
}

module.exports.writeFile = (filePath, content) => {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appPrimary('[archivo]', `${relativeDirPath} ${logger.OK}`)
}

module.exports.updateFile = (filePath, content) => {
  util.writeFile(filePath, content)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appPrimary('[archivo]', `${relativeDirPath} (modificado) ${logger.OK}`)
}

module.exports.removeFile = (filePath) => {
  util.removeFile(filePath)
  const relativeDirPath = filePath.replace(config.PATH.workspace, '')
  logger.appPrimary('[archivo]', `${relativeDirPath} (eliminado) ${logger.OK}`)
}

module.exports.rmdir = (dirPath) => {
  util.rmdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appPrimary('[carpeta]', `${relativeDirPath} (eliminado) ${logger.OK}`)
}

module.exports.mkdir = (dirPath) => {
  util.mkdir(dirPath)
  const relativeDirPath = dirPath.replace(config.PATH.workspace, '')
  logger.appPrimary('[carpeta]', `${relativeDirPath} ${logger.OK}`)
}

module.exports.copyDir = (sourcePath, targetPath) => {
  util.copyDir(sourcePath, targetPath, logger, config.PATH.workspace)
}

module.exports.existLine = (content, str) => {
  let result = false
  content.split('\n').forEach(line => { if (line.trim().indexOf(str) !== -1) result = true })
  return result
}

module.exports.getService = () => {
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
