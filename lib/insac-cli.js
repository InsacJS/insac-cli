const path    = require('path')
const program = require('commander')
const util    = require('./tools/util')
const _       = require('lodash')

const MODULE_FLAG     = '// <!-- [CLI] - [MODULE] --!> //'
const CONFIG_FLAG     = '// <!-- [CLI] - [CONFIG] --!> //'
const COMPONENT_FLAG  = '// <!-- [CLI] - [COMPONENT] --!> //'

program.option('-v, --version', '', version)
program.option('-h, --help', '', help)
program.option('-f, --force', '', false)
program.option('-e, --example', '', false)

program.option('-M, --module <value>')
program.option('-m, --model <value>')
program.option('-r, --resource <value>')

program.option('-t, --type <value>')
program.option('-c, --count <value>')

program.option('--fields <value>')
program.option('--level <value>')
program.option('--method <value>')
program.option('--path <value>')
program.option('--description <value>', '', '')

program.command('new <app> [description]').action(async (app, description) => {
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
})

program.command('add:module <name>').action((name) => {
  if (!name) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(name)))
  const MODULE_TYPE = program.type ? program.type.toUpperCase() : 'RESOURCE'
  if (!['MODULE', 'RESOURCE', 'SENDGRID_MAIL'].includes(MODULE_TYPE)) {
    throwError(`El tipo de módulo '${MODULE_NAME}' no existe. Ejecuta el comando "insac --info" para obtener más información.`)
  }
  const MODULES_PATH = path.resolve(process.cwd(), `src/modules`)
  let modulePath    = path.resolve(MODULES_PATH, MODULE_NAME)
  if (!util.isDir(MODULES_PATH)) { util.mkdir(MODULES_PATH) }
  if (util.isDir(modulePath) && !FORCE) {
    throwError(`El módulo ${MODULE_NAME} ya existe.\nDirectorio: ${modulePath}`)
  }
  if (MODULE_TYPE === 'RESOURCE') {
    util.mkdir(path.resolve(modulePath, `dao`))
    util.mkdir(path.resolve(modulePath, `models`))
    util.mkdir(path.resolve(modulePath, `resources`))
    util.mkdir(path.resolve(modulePath, `seeders`))
    util.mkdir(path.resolve(modulePath, `seeders/prod`))
  }
  if (MODULE_TYPE === 'MODULE') {
    util.mkdir(path.resolve(modulePath, `services`))
  }
  if (MODULE_TYPE === 'SENDGRID_MAIL') {
    util.mkdir(path.resolve(modulePath, `mails`))
    util.copyDir(path.resolve(__dirname, 'templates/welcome'), path.resolve(modulePath, `mails/welcome`))
  }
  let moduleFileSourcePath = path.resolve(__dirname, `./templates/modules/${MODULE_TYPE}.module.js`)
  let moduleFileTargetPath = path.resolve(modulePath, `${MODULE_NAME.toLowerCase()}.module.js`)
  const data = { moduleName: MODULE_NAME }
  let exampleModuleContent = require(moduleFileSourcePath)(data)
  util.writeFile(moduleFileTargetPath, exampleModuleContent)
  // config.js
  const CONFIG_PATH = path.resolve(process.cwd(), 'src/config/app.config.js')
  let configContent = util.readFile(CONFIG_PATH)
  let cambiosConfig = `exports.${MODULE_NAME} = {\n  // TODO\n}\n\n${CONFIG_FLAG}`
  if (MODULE_TYPE === 'SENDGRID_MAIL') {
    let cambiosConfigData = ''
    const SYSTEM_NAME = require(path.resolve(process.cwd(), 'package.json')).name || 'Example'
    cambiosConfigData += `sendGridApiKey : 'SG.Rj-Pbv-KDJGU',\n`
    cambiosConfigData += `  systemName     : '${SYSTEM_NAME}',\n`
    cambiosConfigData += `  systemEmail    : 'system@example.com'`
    cambiosConfig = cambiosConfig.replace('// TODO', cambiosConfigData)
    const welcomeEmailContent = _.replace(util.readFile(path.resolve(__dirname, 'templates/welcome.mail.js')), /EMAIL/g, MODULE_NAME)
    util.writeFile(path.resolve(modulePath, 'mails/welcome/welcome.mail.js'), welcomeEmailContent)
  }
  if (MODULE_TYPE === 'MODULE') {
    const serviceContent = `module.exports = (app) => {\n  const ${MODULE_NAME} = {}\n\n  // TODO\n\n  return ${MODULE_NAME}\n}\n`
    util.writeFile(path.resolve(modulePath, `services/${MODULE_NAME.toLowerCase()}.service.js`), serviceContent)
  }
  if (!existLine(configContent, `exports.${MODULE_NAME} = {`)) {
    configContent = configContent.replace(CONFIG_FLAG, cambiosConfig)
    util.writeFile(CONFIG_PATH, configContent)
  }
  // app.js
  const APP_PATH = path.resolve(process.cwd(), 'src/app.js')
  let appContent = util.readFile(APP_PATH)
  const CAMBIOS_APP = `service.addModule('${MODULE_NAME}')\n${MODULE_FLAG}`
  if (!existLine(appContent, `service.addModule('${MODULE_NAME}'`)) {
    appContent = appContent.replace(MODULE_FLAG, CAMBIOS_APP)
    util.writeFile(APP_PATH, appContent)
  }
  process.stdout.write(`\x1b[32m\n Módulo \x1b[0m${MODULE_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
})

program.command('add:model <model>').action(async (model) => {
  try {
    if (!model) { throwError(`Se requiere el nombre del modelo.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    const FORCE       = program.force || false
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const MODEL_NAME  = _.toLower(_.snakeCase(_.deburr(model)))
    const EXAMPLE     = program.example || false
    const FIELDS      = program.fields ? program.fields.split(',') : []
    const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME, fields: FIELDS, example: EXAMPLE }
    let modelContent = require(path.resolve(__dirname, './templates/example.model.js'))(data)
    let daoContent   = require(path.resolve(__dirname, './templates/example.dao.js'))(data)
    let ok = false
    util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
      if (fileName.toUpperCase() === MODULE_NAME) {
        const MODEL_PATH = path.resolve(dirPath, `models/${MODEL_NAME}.model.js`)
        const DAO_PATH   = path.resolve(dirPath, `dao/${MODEL_NAME}.dao.js`)
        if (util.isFile(MODEL_PATH) && !FORCE) {
          throwError(`El modelo ${MODEL_NAME} ya existe.\nArchivo: ${MODEL_PATH}`)
        }
        util.writeFile(MODEL_PATH, modelContent)
        if (!util.isFile(DAO_PATH)) { util.writeFile(DAO_PATH, daoContent) }
        ok = true
      }
    })
    if (!ok) { throwError(`El módulo ${MODULE_NAME} no existe.`) }
    process.stdout.write(`\x1b[32m\n Modelo \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('add:dao').action(async () => {
  try {
    if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    const FORCE       = program.force || false
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const MODEL_NAME  = _.toLower(_.snakeCase(_.deburr(program.model)))
    if (!util.isFile(path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/models/${MODEL_NAME}.model.js`))) {
      process.stdout.write(`\nAdvertencia: El modelo ${MODEL_NAME} no se encuentra definido dentro del módulo ${MODULE_NAME}.\n`)
    }
    const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME }
    let daoContent = require(path.resolve(__dirname, './templates/example.dao.js'))(data)
    let ok = false
    util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
      if (fileName.toUpperCase() === MODULE_NAME) {
        const DAO_PATH = path.resolve(dirPath, `dao/${MODEL_NAME}.dao.js`)
        if (util.isFile(DAO_PATH) && !FORCE) {
          throwError(`El dao ${MODEL_NAME} ya existe.\nArchivo: ${DAO_PATH}`)
        }
        util.writeFile(DAO_PATH, daoContent)
        ok = true
      }
    })
    if (!ok) { throwError(`El módulo ${MODULE_NAME} no existe.`) }
    process.stdout.write(`\x1b[32m\n Dao \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('add:seed').action(async () => {
  try {
    if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    if (!program.count)  { program.count = '1' }
    const FORCE       = program.force || false
    const COUNT       = parseInt(program.count)
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const MODEL_NAME  = _.toLower(_.snakeCase(_.deburr(program.model)))
    if (!util.isFile(path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/models/${MODEL_NAME}.model.js`))) {
      process.stdout.write(`\nAdvertencia: El modelo ${MODEL_NAME} no se encuentra definido dentro del módulo ${MODULE_NAME}.\n`)
    }
    const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME, app: await getApp(), count: COUNT }
    let seedContent = require(path.resolve(__dirname, './templates/example.seed.js'))(data)
    let ok = false
    util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
      if (fileName.toUpperCase() === MODULE_NAME) {
        const SEED_PATH = path.resolve(dirPath, `seeders/${MODEL_NAME}.seed.js`)
        if (util.isFile(SEED_PATH) && !FORCE) {
          throwError(`El seed ${MODEL_NAME} ya existe.\nArchivo: ${SEED_PATH}`)
        }
        util.writeFile(SEED_PATH, seedContent)
        ok = true
      }
    })
    if (!ok) { throwError(`El módulo ${MODULE_NAME} no existe.`) }
    process.stdout.write(`\x1b[32m\n Seed \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('add:resource <name>').action(async (name) => {
  try {
    if (!name)           { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    const FORCE       = program.force || false
    const GROUP       = name
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const MODEL_NAME  = program.model || name.split('/').pop()
    const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
    if (util.isDir(GROUP_PATH)) {
      if (!FORCE) { throwError(`El recurso ${GROUP} ya existe.\nArchivo: ${GROUP_PATH}`) }
      util.rmdir(GROUP_PATH)
    }
    util.mkdir(GROUP_PATH)
    const addFile = (ext) => {
      const OUTPUT_PATH = path.resolve(GROUP_PATH, `${MODEL_NAME}${ext}`)
      const INPUT_PATH  = path.resolve(__dirname, `./templates/resources/base/example${ext}`)
      let fileContent = require(INPUT_PATH)()
      util.writeFile(OUTPUT_PATH, fileContent)
    }
    addFile('.route.js')
    addFile('.input.js')
    addFile('.output.js')
    addFile('.middleware.js')
    addFile('.controller.js')
    process.stdout.write(`\x1b[32m\n Recurso \x1b[0m${GROUP}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('add:route <key>').action(async (key) => {
  try {
    if (!program.resource) { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    const FORCE       = program.force || false
    const GROUP       = program.resource
    const MODEL       = program.model
    const MODEL_NAME  = program.model || GROUP.split('/').pop()
    const KEY         = key
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const PATH        = program.path        || `/${GROUP}/${KEY}`
    const METHOD      = program.method      || 'get'
    const DESCRIPTION = program.description || ''
    const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
    if (!util.isDir(GROUP_PATH)) {
      if (!FORCE) { throwError(`El recurso ${GROUP} no existe.\nArchivo: ${GROUP_PATH}`) }
      util.mkdir(GROUP_PATH)
    }
    const addFile = (ext) => {
      const TYPE = ext.replace('.js', '').substr(1).toUpperCase()
      let outputPath = path.resolve(GROUP_PATH, `${MODEL_NAME}${ext}`)
      util.find(GROUP_PATH, ext, ({ filePath }) => { outputPath = filePath })
      let fileContent = require(path.resolve(__dirname, `./templates/resources/base/example${ext}`))()
      if (util.isFile(outputPath)) {
        fileContent = util.readFile(outputPath)
        if (existLine(fileContent, `${TYPE}.${KEY} = {`) && !FORCE) {
          throwError(`${TYPE}.${KEY} ya existe.\nArchivo: ${outputPath}\n`)
        }
      }
      const data = { key: KEY, moduleName: MODULE_NAME, path: PATH, method: METHOD, description: DESCRIPTION, model: MODEL }
      let routeContent = require(path.resolve(__dirname, `./templates/route/example/example${ext}`))(data)
      fileContent = fileContent.replace(COMPONENT_FLAG, routeContent)
      fileContent = fileContent.replace(`// const { Field } = require('insac')`, `const { Field } = require('insac')`)
      util.writeFile(outputPath, fileContent)
    }
    addFile('.route.js')
    addFile('.input.js')
    addFile('.output.js')
    addFile('.middleware.js')
    addFile('.controller.js')
    process.stdout.write(`\x1b[32m\n Ruta \x1b[0m${KEY}\x1b[32m creada exitosamente\x1b[0m \u2713\n\n`)
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('gen:resource <name>').action(async (name) => {
  try {
    if (!name)           { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
    if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
    if (!program.module) { program.module = await getDefaultModule() }
    const FORCE       = program.force || false
    const GROUP       = name
    const MODULE_NAME = _.toUpper(_.snakeCase(_.deburr(program.module)))
    const MODEL_NAME  = _.toLower(_.snakeCase(_.deburr(program.model)))
    const LEVEL       = program.level || 0
    const ROUTE_TYPE  = (!program.type || program.type === 'all') ? 'get,getId,create,update,destroy,restore' : program.type
    const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
    if (util.isDir(GROUP_PATH)) {
      if (!FORCE) { throwError(`El recurso ${GROUP} ya existe.\nArchivo: ${GROUP_PATH}`) }
      util.rmdir(GROUP_PATH)
    }
    util.mkdir(GROUP_PATH)
    await createDATA(MODULE_NAME, MODEL_NAME).then(data => {
      data.GROUP      = GROUP
      data.LEVEL      = LEVEL
      data.ROUTE_TYPE = ROUTE_TYPE
      function addFile (ext) {
        const OUTPUT_PATH = path.resolve(GROUP_PATH, `${MODEL_NAME}${ext}`)
        const INPUT_PATH  = path.resolve(__dirname, `./templates/generate/resource/basic/example${ext}`)
        let fileContent = require(INPUT_PATH)(data)
        util.writeFile(OUTPUT_PATH, fileContent)
      }
      addFile('.route.js')
      addFile('.input.js')
      addFile('.output.js')
      addFile('.middleware.js')
      addFile('.controller.js')
      process.stdout.write(`\x1b[32m\n Recurso \x1b[0m${GROUP}\x1b[32m generado exitosamente\x1b[0m \u2713\n\n`)
    }).catch((err) => {
      process.stdout.write(`Error: No se pudo cargar la aplicación, verifique que esta pueda ejecutarse sin problemas e inténtelo nuevamente.\n`)
      console.log(err)
    })
    process.exit(0)
  } catch (err) { throwError('Hubo un error inesperado', err) }
})

program.command('*').action(() => {
  process.stdout.write('\n Comando inválido. Ejecuta el comando "insac --help" para obtener más información.\n\n')
  process.exit(0)
})

program.parse(process.argv)

if (!process.argv.slice(2).length) { help() }

/**
* Devuelve la información de un modelo sequelize que se haya definido en la aplicación.
* @param {String} moduleName - Nombre del módulo al que pertenece el modelo.
* @param {String} modelName  - Nombre del modelo.
* @return {Object}
*/
async function createDATA (moduleName, modelName) {
  process.env.LISTEN = 'false'
  process.env.LOG    = 'false'
  const MODULE_NAME  = moduleName
  const MODEL_NAME   = modelName
  const app          = await getApp()
  const MODEL = app[MODULE_NAME].models[MODEL_NAME]
  if (!MODEL) {
    throwError(`El modelo '${modelName}' no se encuentra definido. Módulo: ${moduleName.toUpperCase()}`)
  }
  const DATA = {
    moduleName : MODULE_NAME,
    modelName  : MODEL_NAME,
    model      : MODEL
  }
  return DATA
}

function getDefaultModule () {
  return new Promise((resolve, reject) => {
    getApp().then(app => {
      const resourceModules = []
      app.MODULES.forEach(moduleName => {
        if (app[moduleName].config.moduleType === 'RESOURCE') { resourceModules.push(moduleName) }
      })
      if (resourceModules.length === 1) {
        return resolve(resourceModules[0])
      } else {
        return throwError(`Se requiere el nombre de un módulo de tipo RESOURCE. Módulos: ${resourceModules.toString()}`)
      }
    }).catch(e => { reject(e) })
  })
}

function getApp () {
  return new Promise((resolve, reject) => {
    process.env.LOG = 'false'
    const app = require(process.cwd()).app
    const retry = async (cnt) => {
      if (!app.loaded) {
        if (cnt > 10) { return reject(new Error('Hubo un error al cargar la aplicación.')) }
        await util.timer(500)
        return retry(cnt++)
      }
      return resolve(app)
    }
    return retry(1)
  })
}

/**
* Indica si una cadena de texto coincide con alguna linea de un bloque de texto.
* @param {String} content - Bloque de texto.
* @param {String} str     - Cadena de texto.
* @return {Boolean}
*/
function existLine (content, str) {
  let result = false
  content.split('\n').forEach(line => { if (line.trim().indexOf(str) !== -1) result = true })
  return result
}

/**
* Muestra un mensaje de error por consola y finaliza el proceso actual.
* @param {String} msg - Mensaje de error.
*/
function throwError (msg, err) {
  process.stdout.write(`\nError: ${msg}\n\n`)
  if (err) { console.log(err) }
  process.exit(1)
}

/**
* Muestra la versión de la aplicación.
*/
function version () {
  process.stdout.write(`insac     : v${insacVersion()}\ninsac-cli : v${cliVersion()}\n`)
}

function cliVersion () {
  let cliPackagePath = path.resolve(__dirname, '../package.json')
  return require(cliPackagePath).version
}

function insacVersion (projectPath = process.cwd()) {
  try {
    let insacPackagePath = path.resolve(projectPath, 'node_modules/insac/package.json')
    return require(insacPackagePath).version
  } catch (e) {
    let defaultInsacPackagePath = path.resolve(__dirname, './templates/package-linux.json')
    return require(defaultInsacPackagePath).dependencies.insac.substr(1)
  }
}

/**
* Muestra información acerca del uso de la herramienta CLI.
*/
function help () {
  process.stdout.write(`\x1b[92m
  |===============================|
  |===  \x1b[93m I N S A C  -  C L I \x1b[92m  ===|
  |===============================|\x1b[0m

  insac     : v${insacVersion()}
  insac-cli : v${cliVersion()}

  Modo de uso: insac [comando] [opciones]

    Comandos:

      new <name> [description]  Crea un nuevo proyecto.

      add:module <name>         Adiciona un nuevo módulo.
      add:model <name>          Adiciona un nuevo modelo.
      add:dao                   Adiciona un nuevo dao.
      add:seed                  Adiciona un nuevo seed.
      add:resource <name>       Adiciona un nuevo recurso.
      add:route <key>           Adiciona una nueva ruta.

      gen:resource <name>       Genera un recurso (CRUD) con el código autogenerado.

    Opciones:

      -v, --version             Muestra el número de versión de la herramienta CLI.
      -h, --help                Muestra información acerca del uso de la herramienta CLI.
      -f, --force               Fuerza la operación.
      -e, --example             Incluye un ejemplo.

      -M, --module <value>      Nombre del módulo.
      -m, --model <value>       Nombre del modelo.
      -r, --resource <value>    Nombre del recurso.

      -t, --type <value>        Tipo de modulo o ruta.
                                  - MODULOS : RESOURCE (default), SENDGRID_MAIL, MODULE.
                                  - RUTAS   : all (default), get, getId, create, update, destroy, restore.
      -c, --count <value>       Cantidad de registros a incluir en el fichero de seeds. [opcional] Valor por defecto: 1

      --fields <value>          Atributos de un modelo separados por comas y el tipo de dato por dos puntos.
                                  - Tipos: STRING (default), INTEGER, FLOAT, BOOLEAN, DATE. [opcional]

      --level <value>           Nivel de submodelos a incluir en el componente OUTPUT. [opcional] Valor por defecto: 0
      --method <value>          Propiedad method de una ruta. [opcional] Valor por defecto: get
      --path <value>            Propiedad path de una ruta. [opcional]
      --description <value>     Propiedad description de una ruta. [opcional]

    Ejemplo para crear un nuevo proyecto:

      insac new blog
      insac add:module api
      insac add:model libro --fields titulo,paginas:INTEGER,precio:FLOAT
      insac add:seed -m libro
      insac gen:resource api/v1/libros -m libro

    Ejemplo para adicionar recursos:

      insac add:resource api/v1/libros -m libro
      insac add:resource api/v1/custom

    Ejemplo para adicionar rutas a un recurso existente:

      insac add:route listar -r api/v1/libros -m libro
      insac add:route listar -r api/v1/libros -m libro -t get,create
      insac add:route welcome -r api/v1/custom

    Ejemplo para crear un recurso en un módulo diferente:

      insac add:resource auth/v1/usuarios -m usuario -M AUTH\n\n`)
}
