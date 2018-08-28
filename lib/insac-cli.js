#!/usr/bin/env node
const path    = require('path')

const config  = require('./config/app.config')
const program = require('./tools/commander-extends')
const logger  = require('./tools/logger')

program.version(`\n  ${config.PROJECT.insacVersion2}\n  ${config.PROJECT.cliVersion2}\n`)

function execute (command, ...args) {
  if (command !== 'new' && !config.PATH.sources && process.argv.length > 2) {
    logger.appError()
    logger.appError('Error:', `Debe dirigirse a la carpeta del proyecto.\n`)
    process.exit(0)
  }
  return require(path.resolve(__dirname, `./commands/${command}`))(...args).catch(e => {
    logger.appError('Error:', `${e.message}\n`)
    process.exit(0)
  })
}

if (process.argv.length === 2) {
  execute('home')
  process.exit(0)
}

program
  .command('new')
  .arguments('<appName>')
  .description('Crea una nueva aplicación.')
  .option('-d, --description <string>', 'Descripción breve del proyecto.')
  .option('-f, --force', 'Fuerza la creación del proyecto (Elimina el proyecto si existe).')
  .option('-v, --project-version <string>', 'Versión del proyecto.', '1.0.0')
  .action((appName, options) => execute('new', appName, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`new academico`)
    logger.appExample(`new academico -d "Sistema académico."`)
    logger.appExample(`new academico -v 2.0.0`)
    logger.appExample()
  })

program
  .command('add:module')
  .arguments('<moduleName>')
  .description('Adiciona un nuevo módulo.')
  .option('-f, --force', 'Fuerza la creación del módulo (Elimina el módulo si existe).')
  .action((moduleName, options) => execute('add_module', moduleName, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:module api`)
    logger.appExample(`add:module api -f`)
    logger.appExample()
  })

program
  .command('add:model')
  .arguments('<modelName>')
  .description('Adiciona un nuevo modelo.')
  .option('-F, --fields <fieldsName>', 'Atributos del modelo.')
  .option('-e, --example', 'Indica si se incluirá un ejemplo.')
  .option('-f, --force', 'Fuerza la creación del modelo (Elimina el modelo si existe).')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .action((modelName, options) => execute('add_model', modelName, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:model libro`)
    logger.appExample(`add:model libro --fields tiulo,autor,precio,estado -f`)
    logger.appExample(`add:model libro --fields titulo:STRING,autor:STRING,precio,FLOAT,estado:ENUM`)
    logger.appExample()
  })

program
  .command('add:seed')
  .arguments('<modelName>')
  .description('Adiciona un archivo de tipo seed en base a un modelo.')
  .option('-f, --force', 'Fuerza la creación del archivo (Elimina el archivo si existe).')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-r, --records <number>', 'Cantidad de registros a insertar.', '1')
  .option('-p, --production', 'Indica si se trata de un fichero seed para producción.')
  .action((modelName, options) => execute('add_seed', modelName, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:seed libro`)
    logger.appExample(`add:seed libro -f`)
    logger.appExample(`add:seed libro -f -r 10`)
    logger.appExample()
  })

program
  .command('add:resource')
  .arguments('<path>')
  .description('Adiciona un recurso.')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-f, --force', 'Fuerza la creación del recurso (Elimina el recurso si existe).')
  .action((path, options) => execute('add_resource', path, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:resource libros`)
    logger.appExample(`add:resource api/v1/libros`)
    logger.appExample()
  })

program
  .command('add:route')
  .arguments('<key>')
  .description('Adiciona una ruta sobre un recurso existente.')
  .option('-d, --description <string>', 'Descripción de la ruta.')
  .option('-f, --force', 'Fuerza la creación de la ruta. [Si ya existe una ruta con la misma clave, esta se creará de todas formas]')
  .option('-m, --model <modelName>', 'Nombre del modelo al que pertenece la ruta.')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-p, --path <string>', 'Dirección URL relativa de la ruta.', '<resource>/<key>')
  .option('-r, --resource <resourceName>', 'Nombre del recurso donde se creará la ruta. [Requerido]')
  .option('-d, --method <string>', 'Método HTTP de la ruta (get, post, put, patch, delete).', 'get')
  .option('-v, --route-version <number>', 'Versión de la ruta (Siempre en el nivel mas alto).')
  .action((key, options) => execute('add_route', key, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:route login -r auth`)
    logger.appExample(`add:route login -r auth -d "Devuelve un token de acceso"`)
    logger.appExample(`add:route listar -r api/v1/libros -m libro`)
    logger.appExample(`add:route crear -r api/v1/libros -m libro -t post`)
    logger.appExample(`add:route obtener -r api/v1/libros -m libro -p api/v1/libros/:id`)
    logger.appExample(`add:route obtener -r api/v2/libros -m libro -t put -v 2 -f`)
    logger.appExample()
  })

program
  .command('add:config')
  .arguments('<type>')
  .description('Adiciona un archivo de configuración (database, server, logger, response, apidoc, ecosystem, <moduleName>).')
  .option('-f, --force', 'Fuerza la creación del archivo (Elimina el archivo si existe).')
  .action((type, options) => execute('add_config', type, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`add:config logger`)
    logger.appExample(`add:config ecosystem`)
    logger.appExample(`add:config auth`)
    logger.appExample()
  })

program
  .command('gen:resource')
  .arguments('<resourceName>')
  .description('Genera un recurso (CRUD) con el código autogenerado.')
  .option('-f, --force', 'Fuerza la creación del recurso (Elimina el recurso si existe).')
  .option('-o, --output-depth <number>', 'Indica el nivel de submodelos que se incluirá en el componente output.', '0')
  .option('-m, --model <modelName>', 'Nombre del modelo al que pertenece el recurso. [Requerido]')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-t, --type <string>', 'Tipo de rutas que incluirá el recurso (get, getId, create, update, destroy, restore).', 'all')
  .option('-v, --resource-version <number>', 'Versión del recurso.')
  .action((resourceName, options) => execute('gen_resource', resourceName, options))
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`gen:resource api/v1/libros -m libro`)
    logger.appExample(`gen:resource api/v2/libros -m libro -v 2`)
    logger.appExample(`gen:resource api/v1/libros -m libro -t get,getId,create,update,destroy,restore,destroy`)
    logger.appExample()
  })

program
  .on('--help', () => {
    logger.appExampleTitle('Ejemplos:')
    logger.appExample(`new blog`)
    logger.appExample(`add:module api`)
    logger.appExample(`add:model libro --fields titulo,nro_paginas:INTEGER,precio:FLOAT`)
    logger.appExample(`add:seed libro`)
    logger.appExample(`gen:resource api/v1/libros -m libro`)
    logger.appExample()
    logger.appExampleTitle('Modo de uso de un comando específico:')
    logger.appExample(`new --help`)
    logger.appExample(`add:module --help`)
    logger.appExample()
  })

program
  .on('command:*', function () {
    const MSG = `  Ejecuta la opción --help para obtener una lista de los comandos disponibles.\n`
    logger.appError()
    logger.appError('Error:', `Comando inválido: '${program.args.join(' ')}'\n`, MSG)
  })

program.parse(process.argv)
