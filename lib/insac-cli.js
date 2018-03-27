const path       = require('path')
const program    = require('commander')
const ncp        = require('ncp').ncp
const util       = require('./tools/util')
const handlebars = require('handlebars')

const MODULE_FLAG = '// <!-- [CLI] - [MODULE] --!> //'
const CONFIG_FLAG = '// <!-- [CLI] - [CONFIG] --!> //'
const ROUTE_FLAG  = '// <!-- [CLI] - [ROUTE] --!> //'

ncp.limit = 16

program.option('-v, --version',         'Número de versión de la aplicación.', version)
program.option('-h, --help',            'Muestra información acerca del uso de la aplicación.', help)
program.option('--module <value>',      'Nombre del módulo.')
program.option('--model <value>',       'Nombre del modelo.')
program.option('--resource <value>',    'Nombre del recurso.')
program.option('--key <value>',         'Identificador único de la ruta por recurso.')
program.option('--path <value>',        'Propiedad path de la ruta [opcional].')
program.option('--description <value>', 'Descripción de la aplicacón [opcional].')
program.option('--method <value>',      'Propiedad method de la ruta [opcional].')
program.option('--description <value>', 'Propiedad description de la ruta [opcional].')
program.option('--type <value>',        'Tipo de modulo ó servicio. MODULOS: module (default), resource, mail. SERVICIOS: local (default), public.')

program.command('new <app>').action((app) => {
  let source                  = path.resolve(__dirname, './templates/app')
  let destination             = path.resolve(process.cwd(), app)
  const APP_NAME              = destination.split(path.sep).pop()
  const APP_DESCRIPTION       = program.description || ''
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
    util.writeFile(packageDestinationPath,  JSON.stringify(pack,  null, 2))
    util.writeFile(packageDestinationPath2, JSON.stringify(pack2, null, 2))

    let readmePath = path.resolve(__dirname, `./templates/README.md`)
    let readmeContent = util.readFile(readmePath)
    const DATA = { appName: APP_NAME, appDescription: APP_DESCRIPTION }
    readmeContent = handlebars.compile(readmeContent)(DATA)
    util.writeFile(path.resolve(destination, 'README.md'), readmeContent)
    console.log(`\x1b[32m\n Proyecto \x1b[0m${app}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  })
})

program.command('create:module <name>').action((name) => {
  const MODULE_NAME = name
  const MODULE_TYPE = program.type || 'module'
  let source                    = path.resolve(__dirname, `./templates/modules/${MODULE_TYPE}`)
  let destination               = path.resolve(process.cwd(), `src/modules/${MODULE_NAME.toUpperCase()}`)
  let moduleFileSourcePath      = path.resolve(__dirname, `./templates/modules/${MODULE_TYPE}/example.module.js`)
  let moduleFileDestinationPath = path.resolve(process.cwd(), `src/modules/${MODULE_NAME.toUpperCase()}/${MODULE_NAME.toLowerCase()}.module.js`)
  ncp(source, destination, function (err) {
    if (err) { return console.error(err) }
    let exampleModuleContent = util.readFile(moduleFileSourcePath)
    const data               = { moduleName: MODULE_NAME.toUpperCase() }
    exampleModuleContent     = handlebars.compile(exampleModuleContent)(data)
    util.writeFile(moduleFileDestinationPath, exampleModuleContent)
    util.removeFile(path.resolve(destination, 'example.module.js'))

    // config.js
    const CONFIG_PATH    = path.resolve(process.cwd(), 'src/config/index.js')
    let configContent    = util.readFile(CONFIG_PATH)
    const CAMBIOS_CONFIG = `exports.${MODULE_NAME.toUpperCase()} = {\n  // TODO\n}\n\n${CONFIG_FLAG}`
    configContent = configContent.replace(CONFIG_FLAG, CAMBIOS_CONFIG)
    util.writeFile(CONFIG_PATH, configContent)

    // app.js
    const APP_PATH = path.resolve(process.cwd(), 'src/app.js')
    let appContent = util.readFile(APP_PATH)
    const CAMBIOS_APP = `service.addModule('${MODULE_NAME.toUpperCase()}')\n${MODULE_FLAG}`
    appContent = appContent.replace(MODULE_FLAG, CAMBIOS_APP)
    util.writeFile(APP_PATH, appContent)

    console.log(`\x1b[32m\n Módulo \x1b[0m${MODULE_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  })
})

program.command('create:dao <model>').action((model) => {
  const MODULE_NAME   = program.module
  const MODEL_NAME    = model
  let daoContent      = util.readFile(path.resolve(__dirname, './templates/example.dao.js'))
  const data = { moduleName: MODULE_NAME.toUpperCase(), modelName: MODEL_NAME }
  daoContent = handlebars.compile(daoContent)(data)
  let ok = false
  util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
    if (fileName === MODULE_NAME.toLowerCase()) {
      util.writeFile(path.resolve(dirPath, `dao/${MODEL_NAME}.dao.js`), daoContent)
      ok = true
    }
  })
  if (ok) {
    console.log(`\x1b[32m\n Dao \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  } else {
    console.log(` No existe el modulo ${MODULE_NAME}\n`)
  }
})

program.command('create:model <model>').action((model) => {
  const MODULE_NAME = program.module
  const MODEL_NAME  = model
  let modelContent  = util.readFile(path.resolve(__dirname, './templates/example.model.js'))
  const data = { schemaName: MODULE_NAME.toLowerCase(), modelName: MODEL_NAME }
  modelContent = handlebars.compile(modelContent)(data)
  let ok = false
  util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
    if (fileName === MODULE_NAME.toLowerCase()) {
      util.writeFile(path.resolve(dirPath, `models/${MODEL_NAME}.model.js`), modelContent)
      ok = true
    }
  })
  if (ok) {
    console.log(`\x1b[32m\n Modelo \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  } else {
    console.log(` No existe el modulo ${MODULE_NAME}\n`)
  }
})

program.command('create:seed <model>').action((model) => {
  const MODULE_NAME = program.module
  const MODEL_NAME  = model
  let seedContent   = util.readFile(path.resolve(__dirname, './templates/example.seed.js'))
  const data = { moduleName: MODULE_NAME.toUpperCase(), modelName: MODEL_NAME }
  seedContent = handlebars.compile(seedContent)(data)
  let ok = false
  util.find(path.resolve(process.cwd(), 'src/modules'), '.module.js', ({ dirPath, fileName }) => {
    if (fileName === MODULE_NAME.toLowerCase()) {
      util.writeFile(path.resolve(dirPath, `seeders/${MODEL_NAME}.seed.js`), seedContent)
      ok = true
    }
  })
  if (ok) {
    console.log(`\x1b[32m\n Seed \x1b[0m${MODEL_NAME}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  } else {
    console.log(` No existe el modulo ${MODULE_NAME}\n`)
  }
})

program.command('create:route <group>').action((group) => {
  const GROUP       = group
  const GROUP_NAME  = GROUP.split('/').pop()
  const KEY         = program.key
  const MODULE_NAME = program.module
  const PATH        = program.path || `/${GROUP}`
  const METHOD      = program.method || 'get'
  const DESCRIPTION = program.description || ''

  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME.toUpperCase()}/routes/${GROUP}`)
  util.mkdir(GROUP_PATH)

  function addFile (ext) {
    const CURRENT_PATH = path.resolve(GROUP_PATH, `${GROUP_NAME}${ext}`)
    let fileContent = util.readFile(path.resolve(__dirname, `./templates/routes/base/base${ext}`))
    if (util.isFile(CURRENT_PATH)) {
      fileContent = util.readFile(CURRENT_PATH)
    }

    let routeContent = util.readFile(path.resolve(__dirname, `./templates/routes/example/example${ext}`))
    routeContent += `\n  ${ROUTE_FLAG}`
    const data = { key: KEY, moduleName: MODULE_NAME.toUpperCase(), path: PATH, method: METHOD, description: DESCRIPTION }
    routeContent = handlebars.compile(routeContent)(data)
    fileContent = fileContent.replace(ROUTE_FLAG, routeContent)
    util.writeFile(CURRENT_PATH, fileContent)
  }

  addFile('.route.js')
  addFile('.input.js')
  addFile('.output.js')
  addFile('.middleware.js')
  addFile('.controller.js')
  console.log(`\x1b[32m\n Route \x1b[0m${KEY}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
})

program.command('create:resource <group>').action((group) => {
  const GROUP       = group
  const GROUP_NAME  = GROUP.split('/').pop()
  const MODULE_NAME = program.module
  const MODEL_NAME  = program.model
  const MODEL       = {
    attributes: {
      username : { fieldName: 'username  ', coma: ',' },
      password : { fieldName: 'password  ', coma: ',' },
      email    : { fieldName: 'email     ', coma: '' }
    },
    pk: { fieldName: 'id_usuario' }
  }
  const GROUP_PATH  = path.resolve(process.cwd(), `src/modules/${MODULE_NAME.toUpperCase()}/routes/${GROUP}`)
  if (util.isDir(GROUP_PATH)) util.rmdir(GROUP_PATH)
  util.mkdir(GROUP_PATH)

  function addFile (ext, key) {
    const CURRENT_PATH = path.resolve(GROUP_PATH, `${GROUP_NAME}${ext}`)

    let fileContent = util.readFile(path.resolve(__dirname, `./templates/routes/base/base${ext}`))
    if (util.isFile(CURRENT_PATH)) {
      fileContent = util.readFile(CURRENT_PATH)
    }

    let routeContent = util.readFile(path.resolve(__dirname, `./templates/resources/${key}/example${ext}`))
    routeContent += `\n  ${ROUTE_FLAG}`

    const DATA = { key: key, modelName: MODEL_NAME, moduleName: MODULE_NAME.toUpperCase(), model: MODEL }
    DATA.MODEL_NAME = MODEL_NAME.toUpperCase()
    if (key === 'listar')     { DATA.path = `/${GROUP}/`;                            DATA.method = 'get';    DATA.description = `Devuelve una lista de registros ${MODEL_NAME}.` }
    if (key === 'obtener')    { DATA.path = `/${GROUP}/:id_${MODEL_NAME}`;           DATA.method = 'get';    DATA.description = `Devuelve un registro ${MODEL_NAME}.` }
    if (key === 'crear')      { DATA.path = `/${GROUP}/`;                            DATA.method = 'post';   DATA.description = `Crea un registro ${MODEL_NAME}.` }
    if (key === 'actualizar') { DATA.path = `/${GROUP}/:id_${MODEL_NAME}`;           DATA.method = 'put';    DATA.description = `Actualiza los datos de un registro ${MODEL_NAME}.` }
    if (key === 'eliminar')   { DATA.path = `/${GROUP}/:id_${MODEL_NAME}`;           DATA.method = 'delete'; DATA.description = `Elimina un registro ${MODEL_NAME}.` }
    if (key === 'restaurar')  { DATA.path = `/${GROUP}/:id_${MODEL_NAME}/restaurar`; DATA.method = 'put';    DATA.description = `Restaura un registro ${MODEL_NAME} que ha sido eliminado.` }
    routeContent = handlebars.compile(routeContent)(DATA)
    fileContent = fileContent.replace(ROUTE_FLAG, routeContent)
    util.writeFile(CURRENT_PATH, fileContent)
  }
  ['listar', 'obtener', 'crear', 'actualizar', 'eliminar', 'restaurar'].forEach(key => {
    addFile('.route.js',      key)
    addFile('.input.js',      key)
    addFile('.output.js',     key)
    addFile('.middleware.js', key)
    addFile('.controller.js', key)
  })
  console.log(`\x1b[32m\n Recurso \x1b[0m${GROUP}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
})

program.command('*').action(() => {
  console.log('Comando inválido. Usa "insac --help" para obtener más información.')
})

program.parse(process.argv)

if (!process.argv.slice(2).length) { help() }

function version () { console.log('2.0.0') }

function help () {
  let msg = `\x1b[32m
  |===============================|
  |===  \x1b[33m I N S A C  -  C L I \x1b[32m  ===|
  |===============================|\x1b[0m

  Modo de uso: insac [comando] [opcion]

    Comandos:

      create <name> [description]        Crea un nuevo proyecto.

    Opciones:

      -v, --version         Muestra el número de versión de la aplicación.
                            Ej.: insac --version

      -h, --help            Muestra información acerca del uso de la aplicación.
                            Ej.: insac --help

    Ejemplos adicionales:

        insac create myApp "Descripción."\n`
  console.log(msg)
}
