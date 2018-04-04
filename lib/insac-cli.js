const path    = require('path')
const program = require('commander')
const ncp     = require('ncp').ncp
const util    = require('./tools/util')

const MODULE_FLAG     = '// <!-- [CLI] - [MODULE] --!> //'
const CONFIG_FLAG     = '// <!-- [CLI] - [CONFIG] --!> //'
const COMPONENT_FLAG  = '// <!-- [CLI] - [COMPONENT] --!> //'

ncp.limit = 16

program.option('-v, --version', '', version)
program.option('-h, --help', '', help)
program.option('-f, --force', '', false)
program.option('-e, --example', '', false)

program.option('-M, --module <value>')
program.option('-m, --model <value>')
program.option('-r, --resource <value>')

program.option('-t, --type <value>')

program.option('--fields <value>')
program.option('--level <value>')
program.option('--method <value>')
program.option('--path <value>')
program.option('--description <value>', '', '')

program.command('new <app> [description]').action((app, description) => {
  if (!app) { throwError(`Se requiere el nombre de la aplicación.`) }
  const FORCE                 = program.force || false
  let source                  = path.resolve(__dirname, './templates/app')
  let destination             = path.resolve(process.cwd(), app)
  if (util.isDir(destination) && !FORCE) {
    throwError(`El directorio ya existe.\nDirectorio: ${destination}`)
  }
  const APP_NAME              = destination.split(path.sep).pop()
  const APP_DESCRIPTION       = description
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
    const CONFIG_PATH    = path.resolve(process.cwd(), 'src/config/app.config.js')
    let configContent    = util.readFile(CONFIG_PATH)
    const CAMBIOS_CONFIG = `exports.${MODULE_NAME} = {\n  // TODO\n}\n\n${CONFIG_FLAG}`
    if (!existLine(configContent, `exports.${MODULE_NAME} = {`)) {
      configContent = configContent.replace(CONFIG_FLAG, CAMBIOS_CONFIG)
      util.writeFile(CONFIG_PATH, configContent)
    }
    // app.js
    const APP_PATH = path.resolve(process.cwd(), 'src/app.js')
    let appContent = util.readFile(APP_PATH)
    const CAMBIOS_APP = `service.addModule('${name}')\n${MODULE_FLAG}`
    if (!existLine(configContent, `service.addModule('${name}'`)) {
      appContent = appContent.replace(MODULE_FLAG, CAMBIOS_APP)
      util.writeFile(APP_PATH, appContent)
    }
    process.stdout.write(`\x1b[32m\n Módulo \x1b[0m${MODULE_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  })
})

program.command('add:model <model>').action((model) => {
  if (!model)          { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = model
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
})

program.command('add:dao').action(() => {
  if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model
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
})

program.command('add:seed').action(() => {
  if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model
  if (!util.isFile(path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/models/${MODEL_NAME}.model.js`))) {
    process.stdout.write(`\nAdvertencia: El modelo ${MODEL_NAME} no se encuentra definido dentro del módulo ${MODULE_NAME}.\n`)
  }
  const data = { moduleName: MODULE_NAME, modelName: MODEL_NAME }
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
})

program.command('add:resource <name>').action((name) => {
  if (!name)           { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const GROUP       = name
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model || name.split('/').pop()
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
  if (util.isDir(GROUP_PATH)) {
    if (!FORCE) { throwError(`El recurso ${GROUP} ya existe.\nArchivo: ${GROUP_PATH}`) }
    util.rmdir(GROUP_PATH)
  }
  util.mkdir(GROUP_PATH)
  function addFile (ext) {
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
})

program.command('add:route <key>').action((key) => {
  if (!program.resource) { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
  if (!program.module)   { throwError(`Se requiere el nombre del módulo.`) }
  const FORCE       = program.force || false
  const GROUP       = program.resource
  const MODEL       = program.model
  const MODEL_NAME  = program.model || GROUP.split('/').pop()
  const KEY         = key
  const MODULE_NAME = program.module.toUpperCase()
  const PATH        = program.path   || `/${GROUP}/${KEY}`
  const METHOD      = program.method || 'get'
  const DESCRIPTION = program.description || ''
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
  if (!util.isDir(GROUP_PATH)) {
    if (!FORCE) { throwError(`El recurso ${GROUP} no existe.\nArchivo: ${GROUP_PATH}`) }
    util.mkdir(GROUP_PATH)
  }
  function addFile (ext) {
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
    if (MODEL) {
      fileContent = fileContent.replace('// const Field = require(insac).Field', 'const Field = require(insac).Field')
    }
    util.writeFile(outputPath, fileContent)
  }
  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')
  process.stdout.write(`\x1b[32m\n Ruta \x1b[0m${KEY}\x1b[32m creada exitosamente\x1b[0m \u2713\n\n`)
})

program.command('gen:resource <name>').action((name) => {
  if (!name)           { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
  if (!program.module) { throwError(`Se requiere el nombre del módulo.`) }
  if (!program.model)  { throwError(`Se requiere el nombre del modelo.`) }
  const FORCE       = program.force || false
  const GROUP       = name
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model
  const LEVEL       = program.level || 1
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
  if (util.isDir(GROUP_PATH)) {
    if (!FORCE) { throwError(`El recurso ${GROUP} ya existe.\nArchivo: ${GROUP_PATH}`) }
    util.rmdir(GROUP_PATH)
  }
  util.mkdir(GROUP_PATH)
  createDATA(MODULE_NAME, MODEL_NAME).then(data => {
    data.GROUP = GROUP
    data.LEVEL = LEVEL
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
})

program.command('gen:route <key>').action((key) => {
  if (!program.resource) { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
  if (!program.module)   { throwError(`Se requiere el nombre del módulo.`) }
  if (!program.model)    { throwError(`Se requiere el nombre del modelo.`) }
  if (program.type && !['listar', 'obtener', 'crear'].includes(program.type)) { throwError('El tipo de ruta es inválido.') }
  const FORCE       = program.force || false
  const GROUP       = program.resource
  const MODEL_NAME  = program.model
  const KEY         = key
  const MODULE_NAME = program.module.toUpperCase()
  const PATH        = program.path        || `/${GROUP}/${KEY}`
  const METHOD      = program.method      || 'get'
  const DESCRIPTION = program.description || ''
  const ROUTE_TYPE  = program.type        || 'listar'
  const LEVEL       = program.level       || 1
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/resources/${GROUP}`)
  if (!util.isDir(GROUP_PATH)) {
    if (!FORCE) { throwError(`El recurso ${GROUP} no existe.\nArchivo: ${GROUP_PATH}`) }
    util.mkdir(GROUP_PATH)
  }
  createDATA(MODULE_NAME, MODEL_NAME).then(data => {
    data.key         = KEY
    data.GROUP       = GROUP
    data.LEVEL       = LEVEL
    data.path        = PATH
    data.method      = METHOD
    data.description = DESCRIPTION
    function addFile (ext) {
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
      data.fileContent = fileContent
      fileContent = require(path.resolve(__dirname, `./templates/generate/route/${ROUTE_TYPE}/example${ext}`))(data)
      util.writeFile(outputPath, fileContent)
    }
    addFile('.route.js')
    addFile('.input.js')
    addFile('.output.js')
    addFile('.middleware.js')
    addFile('.controller.js')
    process.stdout.write(`\x1b[32m\n Ruta \x1b[0m${KEY}\x1b[32m generada exitosamente\x1b[0m \u2713\n\n`)
  }).catch((err) => {
    process.stdout.write(`Error: No se pudo cargar la aplicación, verifique que esta pueda ejecutarse sin problemas e inténtelo nuevamente.\n`)
    console.log(err)
  })
})

program.command('gen:output <key>').action((key) => {
  if (!program.resource) { throwError(`Se requiere el nombre del recurso. Ej.: libros, api/libros, api/v1/libros.`) }
  if (!program.module)   { throwError(`Se requiere el nombre del módulo.`) }
  if (!program.model)    { throwError(`Se requiere el nombre del modelo.`) }
  if (!program.key)      { throwError(`Se requiere la clave de la ruta (key).`) }
  const GROUP       = program.resource
  const MODULE_NAME = program.module.toUpperCase()
  const MODEL_NAME  = program.model
  const LEVEL       = program.level || 1
  const KEY         = program.key
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME}/routes/${GROUP}`)
  let outputPath
  util.find(GROUP_PATH, '.output.js', ({ filePath }) => { outputPath = filePath })
  if (!outputPath) {
    throwError(`El componente ${GROUP} no contiene ningún archivo .output.js`)
  }
  let outputContent = util.readFile(outputPath)
  createDATA(MODULE_NAME, MODEL_NAME).then(data => {
    data.LEVEL = LEVEL
    data.KEY   = KEY
    const EXAMPLE_OUTPUT_PATH = path.resolve(__dirname, './templates/example.output.js')
    const newOutputContent    = require(EXAMPLE_OUTPUT_PATH)(data)
    outputContent = outputContent.replace(COMPONENT_FLAG, newOutputContent)
    util.writeFile(outputPath, outputContent)
    process.stdout.write(`\x1b[32m\n OUTPUT \x1b[0m${KEY}\x1b[32m creado exitosamente\x1b[0m \u2713\n\n`)
  }).catch((err) => {
    process.stdout.write(`Error: No se pudo cargar la aplicación, verifique que esta pueda ejecutarse sin problemas e inténtelo nuevamente.\n`)
    console.log(err)
  })
})

program.command('*').action(() => {
  process.stdout.write('\n Comando inválido. Usa "insac --help" para obtener más información.\n\n')
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
function throwError (msg) {
  process.stdout.write(`Error: ${msg}\n`)
  process.exit(0)
}

/**
* Muestra la versión de la aplicación.
*/
function version () { process.stdout.write('insac-cli: v2.0.0\n') }

/**
* Muestra información acerca del uso de la herramienta CLI.
*/
function help () {
  process.stdout.write(`\x1b[32m
  |===============================|
  |===  \x1b[33m I N S A C  -  C L I \x1b[32m  ===|
  |===============================|\x1b[0m

  Modo de uso: insac [comando] [opciones]

    Comandos:

      new <name> [description]  Crea un nuevo proyecto.
      add:module <name>         Crea un nuevo módulo.
      add:model <name>          Crea un nuevo modelo.
      add:dao                   Crea un nuevo dao.
      add:seed                  Crea un nuevo seed.
      add:resource <name>       Crea un nuevo recurso.
      add:route <key>           Crea una nueva ruta.

      gen:resource <name>       Crea un recurso con el código autogenerado.
      gen:route  <key>          Crea una ruta con el código autogenerado.
      gen:output <key>          Crea un component OUTPUT con el código autogenerado.

    Opciones:

      -v, --version             Muestra el número de versión de la herramienta CLI.
      -h, --help                Muestra información acerca del uso de la herramienta CLI.
      -f, --force               Fuerza la operación.
      -e, --example             Incluye un ejemplo.

      -M, --module <value>      Nombre del módulo.
      -m, --model <value>       Nombre del modelo.
      -r, --resource <value>    Nombre del recurso.

      -t, --type <value>        Tipo de modulo, ruta o servicio.
                                  - MODULOS   : resource (default), mail, module.
                                  - RUTAS     : listar (default), obtener, crear, actualizar, eliminar, restaurar.
                                  - SERVICIOS : local (default), public.

      --fields <value>          Atributos de un modelo separados por comas y el tipo de dato por dos puntos.
                                  - Tipos: STRING (default), INTEGER, FLOAT, BOOLEAN, DATE.

      --level <value>           Nivel de submodelos a incluir en el componente OUTPUT [opcional].
      --method <value>          Propiedad method de una ruta [opcional].
      --path <value>            Propiedad path de una ruta [opcional].
      --description <value>     Propiedad description de una ruta [opcional].

    Ejemplos:

      insac new academico "Sistema de información."

      insac add:module central -t resource
      insac add:model libro -M central --fields titulo,cantidad:INTEGER,precio:FLOAT
      insac add:dao  -m libro -M central
      insac add:seed -m libro -M central
      insac add:resource api/v1/libros -M central -m libro
      insac add:resource api/v1/custom -M central
      insac add:route listar -r api/v1/libros -M central -m libro
      insac add:route welcome -r api/v1/custom -M central

      insac gen:resource api/v1/libros -M central -m libro --level 3
      insac gen:route  listar -r api/v1/libros -M central -m libro --level 3 --type listar
      insac gen:output listar -r api/v1/libros -M central -m libro --level 3\n\n`)
}
