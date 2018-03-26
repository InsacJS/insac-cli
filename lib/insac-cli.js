const path = require('path')
const program = require('commander')
const ncp = require('ncp').ncp
const fs = require('fs')

ncp.limit = 16

program.option('-v, --version', 'Número de versión de la aplicación.', version)
program.option('-h, --help', 'Muestra información acerca del uso de la aplicación.', help)
program.option('--module', 'Nombre del módulo.')
program.option('--model', 'Nombre del modelo.')
program.option('--key', 'Identificador único de la ruta dentro de un recurso.')
program.option('--type-module', 'Tipo de modulo. module (default), resource, mail.')
program.option('--type-service', 'Tipo de servicio. local (default), public.')

program.command('create <app> [description]').action((app, description) => {
  let source = path.resolve(__dirname, './templates/app')
  let destination = path.resolve(process.cwd(), app)
  let packageSourcePath = path.resolve(__dirname, './templates/package.json')
  let packageDestinationPath = path.resolve(process.cwd(), `./${app}/package.json`)
  let pack = require(packageSourcePath)
  pack.name = app
  pack.description = description || ''
  ncp(source, destination, function (err) {
    if (err) { return console.error(err) }
    fs.writeFileSync(packageDestinationPath, JSON.stringify(pack, null, 2))
    console.log(`\x1b[32m\n Proyecto \x1b[0m${app}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  })
})

program.command('create:module <name>').action((app) => {
  console.log("create module OK")
  console.log("PROGRAM = ", program)
  // let source = path.resolve(__dirname, './templates/app')
  // let destination = path.resolve(process.cwd(), app)
  // let packageSourcePath = path.resolve(__dirname, './templates/package.json')
  // let packageDestinationPath = path.resolve(process.cwd(), `./${app}/package.json`)
  // let pack = require(packageSourcePath)
  // pack.name = app
  //
  // ncp(source, destination, function (err) {
  //   if (err) { return console.error(err) }
  //   fs.writeFileSync(packageDestinationPath, JSON.stringify(pack, null, 2))
  //   console.log(`\x1b[32m\n Proyecto \x1b[0m${app}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  // })
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
