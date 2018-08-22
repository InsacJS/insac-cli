const path = require('path')
const util = require('../../lib/tools/util')

let workspacePath = __dirname
let cli           = 'node ../../insac.js'

describe('\n - Prueba de comandos\n', () => {
  before(async () => {
    await util.cmd(`rm -rf app`, __dirname)
  })
  after(async () => {
    // await util.cmd(`rm -rf app`, __dirname)
  })
  describe(` Creación de un nuevo proyecto`, () => {
    it('Comando version', async () => {
      const result = await execute(`--version`)
      console.log(result)
      expect(result.includes('insac     :')).to.equal(true)
      expect(result.includes('insac-cli :')).to.equal(true)
    })
    it('Comando new', async () => {
      await util.cmd(`rm -rf app`, __dirname)
      const result = await execute(`new app`)
      console.log(result)
      verifyDir('app')
      verifyDir('app/src')
      verifyDir('app/src/config')
      verifyFile('app/src/config/database.config.js')
      verifyFile('app/src/config/database.config.js.example')
      verifyFile('app/src/config/server.config.js')
      verifyFile('app/src/config/server.config.js.example')
      verifyFile('app/src/config/logger.config.js')
      verifyFile('app/src/config/logger.config.js.example')
      verifyFile('app/src/app.js', `// <!-- [CLI] - [MODULE] --!> //`, true)
      verifyDir('app/test')
      verifyFile('app/.eslintrc.js')
      verifyFile('app/.gitignore')
      verifyFile('app/ecosystem.config.json')
      verifyFile('app/ecosystem.config.json.example')
      verifyFile('app/index.js')
      verifyFile('app/package.json')
      verifyFile('app/README.md')
    })
    it('Comando add:module RESOURCE', async () => {
      workspacePath = path.resolve(__dirname, 'app')
      cli           = 'node ../../../insac.js'
      const result = await execute(`add:module api`)
      console.log(result)
      verifyDir('src/modules/API')
      verifyFile('src/modules/API/api.module.js')
      verifyFile('src/app.js', `service.addModule('API')`, true)
    })
    it('Comando add:model', async () => {
      const result = await execute(`add:model libro --fields titulo,paginas:INTEGER,precio:FLOAT`)
      console.log(result)
      verifyFile('src/modules/API/models/libro.model.js')
      verifyFile('src/modules/API/dao/libro.dao.js')
    })
    it('Comando add:seed', async () => {
      const result = await execute(`add:seed libro`)
      console.log(result)
      verifyFile('src/modules/API/seeders/libro.seed.js')
    })
    it('Comando add:resource', async () => {
      const result = await execute(`add:resource api/v1/custom`)
      console.log(result)
      verifyDir('src/modules/API/resources/api/v1/custom')
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.get', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.getId', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.create', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.update', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.destroy', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.restore', false)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.input.js')
      verifyFile('src/modules/API/resources/api/v1/custom/custom.middleware.js')
      verifyFile('src/modules/API/resources/api/v1/custom/custom.output.js')
      verifyFile('src/modules/API/resources/api/v1/custom/custom.route.js')
    })
    it('Comando add:route por defecto', async () => {
      const result = await execute(`add:route get -r api/v1/custom`)
      console.log(result)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.controller.js', 'CONTROLLER.get', true)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.input.js', 'INPUT.get', true)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.middleware.js', 'MIDDLEWARE.get', true)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.output.js', 'OUTPUT.get', true)
      verifyFile('src/modules/API/resources/api/v1/custom/custom.route.js', 'ROUTE.get', true)
    })
    it('Comando add:route con tipo de ruta', async () => {
      let result = await execute(`add:resource api/v1/aaa`)
      console.log(result)
      result = await execute(`add:route create -r api/v1/aaa -t post`)
      console.log(result)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.get', false)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.getId', false)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.create', true)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.update', false)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.destroy', false)
      verifyFile('src/modules/API/resources/api/v1/aaa/aaa.controller.js', 'CONTROLLER.restore', false)
    })
    it('Comando gen:resource con todas las rutas', async () => {
      const result = await execute(`gen:resource api/v1/libros -m libro`)
      console.log(result)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.get', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.getId', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.create', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.update', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.destroy', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libro.controller.js', 'CONTROLLER.restore', true)
    })
    it('Comando gen:resource con algunas rutas', async () => {
      const result = await execute(`gen:resource api/v2/libros -m libro -t get,create`)
      console.log(result)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.get', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.getId', false)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.create', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.update', false)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.destroy', false)
      verifyFile('src/modules/API/resources/api/v2/libros/libro.controller.js', 'CONTROLLER.restore', false)
    })
    it('Prueba la instalación del servicio', async () => {
      updateDatabaseConfig()
      clearEnv()
      await util.cmd(`npm run setup`, workspacePath).catch(e => {
        console.log(e)
      })
    })
  })
})

async function execute (command) {
  return util.cmd(`${cli} ${command}`, workspacePath)
}

function verifyDir (dirPath) {
  const DIR_PATH = path.resolve(workspacePath, dirPath)
  expect(util.isDir(DIR_PATH)).to.equal(true)
}

function verifyFile (filePath, content, result = true) {
  const FILE_PATH = path.resolve(workspacePath, filePath)
  expect(util.isFile(FILE_PATH)).to.equal(true)
  if (content) {
    const FILE_CONTENT = util.readFile(FILE_PATH)
    expect(FILE_CONTENT.includes(content)).to.equals(result)
  }
}

function updateDatabaseConfig () {
  const DATABASE_CONFIG_PATH = path.resolve(workspacePath, 'src/config/database.config.js')
  let content = util.readFile(DATABASE_CONFIG_PATH)
  content = content.replace('process.env.DB_PORT || 5432', 'process.env.DB_PORT || 54324')
  util.writeFile(DATABASE_CONFIG_PATH, content)
  delete require.cache[DATABASE_CONFIG_PATH]
}

function clearEnv () {
  delete process.env.PROJECT_PATH
  delete process.env.PROTOCOL
  delete process.env.HOSTNAME
  delete process.env.PORT
  delete process.env.NODE_ENV
  delete process.env.SQL_LOG
  delete process.env.DB_USER
  delete process.env.DB_PASS
  delete process.env.DB_NAME
  delete process.env.DB_HOST
  delete process.env.DB_PORT
  delete process.env.DB_TZ
  delete process.env.DIALECT
  delete process.env.APIDOC
  delete process.env.LOGGER
  delete process.env.SETUP
  delete process.env.START
}
