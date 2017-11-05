'use strict'
const path = require('path')
const program = require('commander')
const ncp = require('ncp').ncp;
const fs = require('fs')

ncp.limit = 16

var Insac

program.option('-v, --version', 'Número de versión de la aplicación.', version)
program.option('-h, --help', 'Muestra información acerca del uso de la aplicación.', help)
program.option('-p, --path <value>')
program.option('-e, --env <value>', 'Entorno de ejecución.')
program.option('-o, --output <value>')

program.command('migrate').action(() => {
  validateProjectPath()
  process.env.NODE_ENV = (program.env) ? program.env : 'development'
  let app = new Insac()
  let modelsPath = program.path ? program.path : undefined
  app.load()
  app.migrate(modelsPath).then(() => {
    process.exit(0)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
})

program.command('seed').action(() => {
  validateProjectPath()
  process.env.NODE_ENV = (program.env) ? program.env : 'development'
  let app = new Insac()
  app.load()
  app.addSeeders()
  app.seed().then(() => {
    process.exit(0)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
})

program.command('apidoc').action(() => {
  validateProjectPath()
  process.env.NODE_ENV = (program.env) ? program.env : 'development'
  let app = new Insac()
  app.load()
  app.createApidoc().then(() => {
    process.exit(0)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
})

program.command('create <app> [description]').action((app, description) => {
  let source = path.resolve(__dirname, './template/app')
  let destination = path.resolve(process.cwd(), app)
  let packageSourcePath = path.resolve(__dirname, './template/package.json')
  let packageDestinationPath = path.resolve(process.cwd(), `./${app}/package.json`)
  let pack = require(packageSourcePath)
  pack.name = app
  pack.description = description || ''
  ncp(source, destination, function (err) {
   if (err) {
     return console.error(err);
   }
   fs.writeFileSync(packageDestinationPath, JSON.stringify(pack, null, 2))
   console.log(`\x1b[32m\n Proyecto \x1b[0m${app}\x1b[32m creado exitosamente\x1b[0m \u2713\n`)
  });
})

program.command('*').action(() => {
  console.log('Comando inválido. Usa insac --help para obtener más información.')
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  help()
}

function version() {
  console.log('0.1.0')
}

function help() {
  let msg = `\x1b[32m
   |===============================|
   |===  \x1b[33m I N S A C  -  C L I \x1b[32m  ===|
   |===============================|\x1b[0m

  Modo de uso: insac [comando] [opcion]

    Comandos:

      migrate       Crea todas las tablas de la base de datos.
      seed          Adiciona datos.
      apidoc        Crea la documentación (APIDOC).
      create        Crea un nuevo proyecto.

    Opciones:

      -v, --version               Muestra el número de versión de la aplicación.

                                  Ej.: insac --version

      -h, --help                  Muestra información acerca del uso de la aplicación.

                                  Ej.:  insac --help

      -e, --env <value>           Ejecuta un comando para un determinado entorno de ejecución.
                                  Se utiliza junto con el comando seed.
                                  El valor por defecto es 'development'.

                                  Ej.:  insac seed --env production

      -p, --models-path <value>   Nombre de una carpeta que se encuentre dentro de la carpeta 'models'.
                                  Sólo se crearán las tablas que se encuentren dentro de esta carpeta.
                                  Por defecto es la carpeta donde se encuentran todos los modelos.

                                  Ej.:  insac migrate --models-path central

                                  Este comando solamente creará aquellas tablas cuyos modelos
                                  se encuentren dentro de la carpeta 'models/central'.

    Ejemplos adicionales:

        insac migrate
        insac migrate --models-path central
        insac seed
        insac seed --env production
        insac apidoc
`
  console.log(msg)
}

function validateProjectPath() {
  let configPath
  try {
    const projectPath = process.cwd()
    configPath = path.resolve(projectPath, '.insac.js')
    require(configPath)
    global.CLI = true
    Insac = require(path.resolve(projectPath, './node_modules/insac/lib/Insac'))
  } catch (err) {
    if (err.toString() === `Error: Cannot find module '${configPath}'`) {
      console.log(`Se requiere el archivo '${configPath}'`)
    } else {
      console.log(err)
    }
    process.exit(1)
  }
}
