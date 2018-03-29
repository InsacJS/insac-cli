const path       = require('path')
const program    = require('commander')
const ncp        = require('ncp').ncp
const util       = require('./tools/util')

const MODULE_FLAG = '// <!-- [CLI] - [MODULE] --!> //'
const CONFIG_FLAG = '// <!-- [CLI] - [CONFIG] --!> //'
const ROUTE_FLAG  = '// <!-- [CLI] - [ROUTE] --!> //'

ncp.limit = 16

program.option('-v, --version',          'Número de versión de la aplicación.', version)
program.option('-h, --help',             'Muestra información sobre el uso de la herramienta CLI.', help)
program.option('-f, --force',            'Fuerza la operación.')
program.option('-M, --module <value>',   'Nombre del módulo.')
program.option('-m, --model <value>',    'Nombre del modelo.')
program.option('-r, --resource <value>', 'Nombre del recurso.')
program.option('-k, --key <value>',      'Identificador único de la ruta por recurso.')
program.option('-p, --path <value>',     'Propiedad path de la ruta [opcional].')
program.option('-d, --desc <value>',     'Descripción [opcional].', '')
program.option('-t, --type <value>',     'Tipo de modulo ó servicio. MODULOS: module, resource (default), mail. SERVICIOS: local (default), public.')
program.option('--fields <value>',       'Campos del modelo separados por comas. Por defecto son de tipo STRING.')
program.option('--method <value>',       'Propiedad method de la ruta [opcional].')

function exist (content, str) {
  let result = false
  content.split('\n').forEach(line => { if (line.trim() === str) result = true })
  return result
}

function throwError (msg) {
  console.error(msg)
  process.exit(0)
}

program.command('new <app>').action((app) => {
  if (!app) { throwError(`Se requiere el nombre de la aplicación.`) }
  const FORCE                 = program.force || false
  let source                  = path.resolve(__dirname, './templates/app')
  let destination             = path.resolve(process.cwd(), app)
  if (util.isDir(destination) && !FORCE) {
    throwError(`El directorio ya existe.\nDirectorio: ${destination}`)
  }
  const APP_NAME              = destination.split(path.sep).pop()
  const APP_DESCRIPTION       = program.desc
  let packageSourcePath       = path.resolve(__dirname, './templates/package.json')
  let packageSourcePath2      = path.resolve(__dirname, './templates/package-lock.json')
  let packageDestinationPath  = path.resolve(process.cwd(), `./${app}/package.json`)
  let packageDestinationPath2 = path.resolve(process.cwd(), `./${app}/package-lock.json`)
  let pack         = require(packageSourcePath)
  let pack2        = require(packageSourcePath2)
  pack.name        = APP_NAME
  pack2.name       = APP_NAME
  pack.description = APP_DESCRIPTION
  ncp(source, destination, function (err) {
    if (err) { return console.error(err) }
    util.writeFile(packageDestinationPath,  `${JSON.stringify(pack,  null, 2)}\n`)
    util.writeFile(packageDestinationPath2, `${JSON.stringify(pack2, null, 2)}\n`)
    let readmeContent = `# ${APP_NAME}\n${APP_DESCRIPTION ? `\n${APP_DESCRIPTION}\n` : ''}`
    util.writeFile(path.resolve(destination, 'README.md'), readmeContent)
    process.stdout.write(`\x1b[32m\n Proyecto \x1b[0m${app}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  })
})

program.command('add:module <name>').action((name) => {
  if (!name) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = name.toUpperCase()
  const MODULE_TYPE = program.type || 'resource'
  let source        = path.resolve(__dirname, `./templates/modules/${MODULE_TYPE}`)
  let destination   = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}`)
  if (util.isDir(destination) && !FORCE) {
    throwError(`El módulo ${MODULE_NAME} ya existe.\nDirectorio: ${destination}`)
  }
  let moduleFileSourcePath      = path.resolve(__dirname, `./templates/modules/${MODULE_TYPE}/example.module.js`)
  let moduleFileDestinationPath = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/${MODULE_NAME.toLowerCase()}.module.js`)
  ncp(source, destination, function (err) {
    if (err) { return console.error(err) }
    const data = { moduleName: MODULE_NAME }
    let exampleModuleContent = require(moduleFileSourcePath)(data)
    util.writeFile(moduleFileDestinationPath, exampleModuleContent)
    util.removeFile(path.resolve(destination, 'example.module.js'))
    // config.js
    const CONFIG_PATH    = path.resolve(process.cwd(), 'src/config/index.js')
    let configContent    = util.readFile(CONFIG_PATH)
    const CAMBIOS_CONFIG = `exports.${MODULE_NAME} = {\n  // TODO\n}\n\n${CONFIG_FLAG}`
    if (!exist(configContent, `exports.${MODULE_NAME} = {`)) {
      configContent = configContent.replace(CONFIG_FLAG, CAMBIOS_CONFIG)
      util.writeFile(CONFIG_PATH, configContent)
    }
    // app.js
    const APP_PATH = path.resolve(process.cwd(), 'src/app.js')
    let appContent = util.readFile(APP_PATH)
    const CAMBIOS_APP = `service.addModule('${MODULE_NAME}')\n${MODULE_FLAG}`
    if (!exist(configContent, `service.addModule('${MODULE_NAME}')`)) {
      appContent = appContent.replace(MODULE_FLAG, CAMBIOS_APP)
      util.writeFile(APP_PATH, appContent)
    }
    process.stdout.write(`\x1b[32m\n Módulo \x1b[0m${MODULE_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  })
})

program.command('add:dao <model>').action((model) => {
  if (!model)          { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = model
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
})

program.command('add:model <model>').action((model) => {
  if (!model)          { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = model
  const FIELDS      = program.fields ? program.fields.split(',') : []
  const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME, fields: FIELDS }
  let modelContent = require(path.resolve(__dirname, './templates/example.model.js'))(data)
  let ok = false
  util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
    if (fileName.toUpperCase() === MODULE_NAME) {
      const MODEL_PATH = path.resolve(dirPath, `models/${MODEL_NAME}.model.js`)
      if (util.isFile(MODEL_PATH) && !FORCE) {
        throwError(`El modelo ${MODEL_NAME} ya existe.\nArchivo: ${MODEL_PATH}`)
      }
      util.writeFile(MODEL_PATH, modelContent)
      ok = true
    }
  })
  if (!ok) { throwError(`El módulo ${MODULE_NAME} no existe.`) }
  process.stdout.write(`\x1b[32m\n Modelo \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
})

program.command('add:seed <model>').action((model) => {
  if (!model)          { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = model
  const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME }
  let seedContent   = require(path.resolve(__dirname, './templates/example.seed.js'))(data)
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
})

program.command('add:route <group>').action((group) => {
  if (!group)          { throwError(`Se requiere el grupo al que pertenece la ruta (directorio).`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  if (!program.key)    { throwError(`Se requiere el código de la ruta (key).`) }
  const FORCE       = program.force || false
  const GROUP       = group
  const GROUP_NAME  = GROUP.split('/').pop()
  const KEY         = program.key
  const MODULE_NAME = program.module.toUpperCase()
  const PATH        = program.path   || `/${GROUP}/${KEY}`
  const METHOD      = program.method || 'get'
  const DESCRIPTION = program.desc   || ''
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/routes/${GROUP}`)
  util.mkdir(GROUP_PATH)
  function addFile (ext) {
    const TYPE = ext.replace('.js', '').substr(1).toUpperCase()
    let outputPath = path.resolve(GROUP_PATH, `${GROUP_NAME}${ext}`)
    util.find(GROUP_PATH, ext, ({ filePath }) => { outputPath = filePath })
    let fileContent = require(path.resolve(__dirname, `./templates/routes/base/base${ext}`))()
    if (util.isFile(outputPath)) {
      fileContent = util.readFile(outputPath)
      if (exist(fileContent, `${TYPE}.${KEY} = {`) && !FORCE) {
        throwError(`${TYPE}.${KEY} ya existe.\nArchivo: ${outputPath}\n`)
      }
    }
    const data = { key: KEY, moduleName: MODULE_NAME, path: PATH, method: METHOD, description: DESCRIPTION }
    let routeContent = require(path.resolve(__dirname, `./templates/routes/example/example${ext}`))(data)
    fileContent = fileContent.replace(ROUTE_FLAG, routeContent)
    util.writeFile(outputPath, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')
  process.stdout.write(`\x1b[32m\n Route \x1b[0m${KEY}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
})

program.command('add:resource <group>').action((group) => {
  if (!group)          { throwError(`Se requiere el grupo al que pertenece el recurso (directorio).`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
  const GROUP       = group
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/routes/${GROUP}`)
  if (util.isDir(GROUP_PATH)) util.rmdir(GROUP_PATH)
  util.mkdir(GROUP_PATH)
  createDATA(MODULE_NAME, MODEL_NAME).then(data => {
    data.GROUP = GROUP
    function addFile (ext) {
      const OUTPUT_PATH = path.resolve(GROUP_PATH, `${MODEL_NAME}${ext}`)
      const INPUT_PATH  = path.resolve(__dirname, `./templates/resources/base/base${ext}`)
      let fileContent = require(INPUT_PATH)(data)
      util.writeFile(OUTPUT_PATH, fileContent)
    }
    addFile('.route.js')
    addFile('.input.js')
    addFile('.output.js')
    addFile('.middleware.js')
    addFile('.controller.js')
    process.stdout.write(`\x1b[32m\n Recurso \x1b[0m${GROUP}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  }).catch(() => {
    process.stdout.write(`Hubo un problema al cargar la aplicación, verifique e inténtelo nuevamente.\n`)
    process.exit(0)
  })
})

async function createDATA (moduleName, modelName) {
  process.env.LISTEN = 'false'
  process.env.LOG    = 'false'
  const MODULE_NAME  = moduleName
  const MODEL_NAME   = modelName
  const app          = require(process.cwd()).app
  const retry = async (cnt) => {
    if (!app[MODULE_NAME].models) {
      if (cnt > 10) { throwError('Hubo un error al carga la aplicación.') }
      await util.timer(500)
      return retry(cnt++)
    }
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
  return retry(1)
}

program.command('*').action(() => {
  process.stdout.write('Comando inválido. Usa "insac --help" para obtener más información.\n')
  process.exit(0)
})

program.parse(process.argv)

if (!process.argv.slice(2).length) { help() }

function version () { process.stdout.write('2.0.0\n') }

function help () {
  let msg = `\x1b[32m
  |===============================|
  |===  \x1b[33m I N S A C  -  C L I \x1b[32m  ===|
  |===============================|\x1b[0m

  Modo de uso: insac [comando] [opcion]

    Comandos:

      new <name> [description]  Crea un nuevo proyecto.

    Opciones:

      -v, --version             Número de versión de la aplicación.

      -h, --help                Muestra información sobre el uso de la herramienta CLI.

      -f, --force               Fuerza la operación.

      -M, --module <value>      Nombre del módulo.

      -m, --model <value>       Nombre del modelo.

      -r, --resource <value>    Nombre del recurso.

      -k, --key <value>         Identificador único de la ruta por recurso.

      -p, --path <value>        Propiedad path de la ruta [opcional].

      -d, --desc <value>        Descripción [opcional].

      -t, --type <value>        Tipo de modulo ó servicio.
                                  - MODULOS   : module, resource (default), mail.
                                  - SERVICIOS : local (default), public.

      --fields <value>          Campos del modelo separados por comas.
                                  - Tipos: STRING (default), INTEGER, FLOAT, BOOLEAN, DATE.

      --method <value>          Propiedad method de la ruta [opcional].

    Ejemplos:

        insac new myApp "Descripción de la aplicación."

        insac add:module central -t resource

        insac add:model libro -M central --fields titulo,cantidad:INTEGER,precio:FLOAT

        insac add:dao libro -M central

        insac add:seed libro -M central

        insac add:resource api/v1/libros -M central -m libro

        insac add:route auth -M central -key login\n\n`
  process.stdout.write(msg)
}
