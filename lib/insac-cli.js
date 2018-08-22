#!/usr/bin/env node
const path    = require('path')
const config  = require('./config/app.config')
const program = require('./tools/commander-extends')

program.version(`\n  ${config.PROJECT.insacVersion2}\n  ${config.PROJECT.cliVersion2}\n`)

function execute (command, ...args) {
  return require(path.resolve(__dirname, `./commands/${command}`))(...args).catch(e => {
    console.error()
    console.error(`  ${e.message}`)
    console.error()
    console.error(e)
    process.exit(1)
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
  .option('-v, --version <string>', 'Versión del proyecto.', '1.0.0')
  .action((appName, options) => execute('new', appName, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac new academico')
    console.log('    $ insac new academico -d "Sistema académico."')
    console.log('    $ insac new academico -v 2.0.0')
    console.log()
  })

program
  .command('add:module')
  .arguments('<moduleName>')
  .description('Adiciona un nuevo módulo.')
  .option('-f, --force', 'Fuerza la creación del módulo (Elimina el módulo si existe).')
  .action((moduleName, options) => execute('add_module', moduleName, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac add:module api')
    console.log('    $ insac add:module api -f')
    console.log()
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
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac add:model libro')
    console.log('    $ insac add:model libro --fields tiulo,autor,precio,estado -f')
    console.log(`    $ insac add:model libro --fields titulo:STRING,autor:STRING,precio,FLOAT,estado:ENUM`)
    console.log(`    $ insac add:model libro --fields "autor:STRING(100),estado:ENUM(['ACTIVO','INACTIVO'])"`)
    console.log()
  })

program
  .command('add:seed')
  .arguments('<modelName>')
  .description('Adiciona un archivo de tipo seed en base a un modelo.')
  .option('-f, --force', 'Fuerza la creación del archivo (Elimina el archivo si existe).')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-r, --records <number>', 'Cantidad de registros a insertar.', '1')
  .action((modelName, options) => execute('add_seed', modelName, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac add:seed libro')
    console.log('    $ insac add:seed libro -f')
    console.log('    $ insac add:seed libro -f -r 10')
    console.log()
  })

program
  .command('add:resource')
  .arguments('<path>')
  .description('Adiciona un recurso.')
  .option('-m, --model <modelName>', 'Nombre del modelo al que pertenece el recurso.')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-f, --force', 'Fuerza la creación del recurso (Elimina el recurso si existe).')
  .action((path, options) => execute('add_resource', path, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac add:resource libros')
    console.log('    $ insac add:resource api/v1/libros')
    console.log('    $ insac add:resource api/v1/libros -m libro')
    console.log()
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
  .option('-t, --type <string>', 'Tipo de ruta (get, post, put, patch, delete).', 'get')
  .option('-v, --version <number>', 'Versión de la ruta (Siempre en el nivel mas alto).')
  .action((key, options) => execute('add_route', key, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac add:route login -r auth')
    console.log('    $ insac add:route login -r auth -d "Devuelve un token de acceso"')
    console.log('    $ insac add:route listar -r api/v1/libros -m libro')
    console.log('    $ insac add:route crear -r api/v1/libros -m libro -t post')
    console.log('    $ insac add:route obtener -r api/v1/libros -m libro -p api/v1/libros/:id')
    console.log('    $ insac add:route obtener -r api/v2/libros -m libro -t put -v 2 -f')
    console.log()
  })

program
  .command('gen:resource')
  .arguments('<resourceName>')
  .description('Genera un recurso (CRUD) con el código autogenerado.')
  .option('-f, --force', 'Fuerza la creación del recurso (Elimina el recurso si existe).')
  .option('-l, --level', 'Indica el nivel de submodelos que se incluirá en el componente output.', '0')
  .option('-m, --model <modelName>', 'Nombre del modelo al que pertenece el recurso. [Requerido]')
  .option('-M, --module <moduleName>', 'Nombre del módulo. [Requerido si existen varios módulos]')
  .option('-t, --type <string>', 'Tipo de rutas que incluirá el recurso (get, getId, create, update, destroy, restore).', 'all')
  .option('-v, --version <number>', 'Versión del recurso.')
  .action((resourceName, options) => execute('gen_resource', resourceName, options))
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac gen:resource api/v1/libros -m libro')
    console.log('    $ insac gen:resource api/v2/libros -m libro -v 2')
    console.log('    $ insac gen:resource api/v1/libros -m libro -t get,getId,create,update,destroy,restore,destroy')
    console.log()
  })

program
  .on('--help', () => {
    console.log('  Ejemplos:')
    console.log()
    console.log('    $ insac new blog')
    console.log('    $ insac add:module api')
    console.log('    $ insac add:model libro --fields titulo,nro_paginas:INTEGER,precio:FLOAT')
    console.log('    $ insac add:seed libro')
    console.log('    $ insac gen:resource api/v1/libros -m libro')
    console.log()
  })

program
  .on('command:*', function () {
    console.error()
    console.error('  Comando inválido: %s', program.args.join(' '))
    console.error()
    console.error('  Ejecuta la opción --help para obtener una lista de los comandos disponibles.')
    console.error()
  })

program.parse(process.argv)
