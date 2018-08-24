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
      // console.log(result)
      expect(result.includes('insac     :')).to.equal(true)
      expect(result.includes('insac-cli :')).to.equal(true)
    })

    it(`Comando new app`, async () => {
      await util.cmd(`rm -rf app`, __dirname)
      const result = await execute(`new app`)
      // console.log(result)
      expect(result.includes('creado exitosamente')).to.equal(true)
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
      verifyFile('app/index.js')
      verifyFile('app/package.json')
      verifyFile('app/README.md')
    })

    it(`Comando new app --force`, async () => {
      let result = await execute(`new app`)
      // console.log(result)
      expect(result.includes(`Ya existe el proyecto 'app'`)).to.equal(true)
      result = await execute(`new app --force`)
      // console.log(result)
      expect(result.includes('creado exitosamente')).to.equal(true)
    })

    it(`Comando new app --description --project-version`, async () => {
      await util.cmd(`rm -rf app`, __dirname)
      let result = await execute(`new app --description "Descripción personalizada" --project-version 1.2.3`)
      // console.log(result)
      expect(result.includes('creado exitosamente')).to.equal(true)
      verifyFile('app/package.json', `"description": "Descripción personalizada"`, true)
      verifyFile('app/package.json', `"version": "1.2.3"`, true)
    })

    it('Comando add:module', async () => {
      workspacePath = path.resolve(__dirname, 'app')
      cli           = 'node ../../../insac.js'
      const result = await execute(`add:module api`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyDir('src/modules/API')
      verifyFile('src/modules/API/api.module.js')
      verifyFile('src/app.js', `service.addModule('API')`, true)
    })

    it('Comando add:module --force', async () => {
      let result = await execute(`add:module api`)
      // console.log(result)
      expect(result.includes(`Ya existe el módulo 'api'`)).to.equal(true)
      result = await execute(`add:module api --force`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
    })

    it('Comando add:model', async () => {
      const result = await execute(`add:model libro`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      const DAO_PATH = path.resolve(workspacePath, 'src/modules/API/dao/libro.dao.js')
      expect(util.isFile(DAO_PATH)).to.equal(true)
      verifyFile('src/modules/API/models/libro.model.js')
      verifyFile('src/modules/API/models/libro.model.js', `// Ejemplo.-`, false)
      verifyFile('src/modules/API/dao/libro.dao.js')
    })

    it('Comando add:model --force', async () => {
      let result = await execute(`add:model libro`)
      // console.log(result)
      expect(result.includes(`Ya existe el modelo 'libro'`)).to.equal(true)
      result = await execute(`add:model libro --force`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
    })

    it('Comando add:model --fields --example', async () => {
      const result = await execute(`add:model libro --fields titulo,paginas:INTEGER,precio:FLOAT --force --example`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyFile('src/modules/API/models/libro.model.js')
      verifyFile('src/modules/API/models/libro.model.js', `titulo: Field.STRING`, true)
      verifyFile('src/modules/API/models/libro.model.js', `paginas: Field.INTEGER`, true)
      verifyFile('src/modules/API/models/libro.model.js', `precio: Field.FLOAT`, true)
      verifyFile('src/modules/API/models/libro.model.js', `// Ejemplo.-`, true)
      verifyFile('src/modules/API/dao/libro.dao.js')
    })

    it('Comando add:seed', async () => {
      const result = await execute(`add:seed libro`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyFile('src/modules/API/seeders/libro.seed.js', `for (let i = 1; i <= 1; i++)`, true)
    })

    it('Comando add:seed --force', async () => {
      let result = await execute(`add:seed libro`)
      // console.log(result)
      expect(result.includes(`Ya existe el seed 'libro'`)).to.equal(true)
      result = await execute(`add:seed libro --force`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
    })

    it('Comando add:seed --records', async () => {
      let result = await execute(`add:seed libro --force --records 10`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyFile('src/modules/API/seeders/libro.seed.js', `for (let i = 1; i <= 10; i++)`, true)
    })

    it('Comando add:resource', async () => {
      let result = await execute(`add:resource api/v1/libros`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyDir('src/modules/API/resources/api/v1/libros')
      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js')
      verifyFile('src/modules/API/resources/api/v1/libros/libros.input.js')
      verifyFile('src/modules/API/resources/api/v1/libros/libros.output.js')
      verifyFile('src/modules/API/resources/api/v1/libros/libros.middleware.js')
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.get', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.getId', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.create', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.update', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.destroy', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.restore', false)

      result = await execute(`add:resource custom`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyDir('src/modules/API/resources/custom')
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.get', false)
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.getId', false)
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.create', false)
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.update', false)
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.destroy', false)
      verifyFile('src/modules/API/resources/custom/custom.controller.js', 'CONTROLLER.restore', false)
      verifyFile('src/modules/API/resources/custom/custom.input.js')
      verifyFile('src/modules/API/resources/custom/custom.middleware.js')
      verifyFile('src/modules/API/resources/custom/custom.output.js')
      verifyFile('src/modules/API/resources/custom/custom.route.js')
    })

    it('Comando add:resource --force', async () => {
      let result = await execute(`add:resource api/v1/libros`)
      // console.log(result)
      expect(result.includes(`Ya existe el recurso 'api/v1/libros'`)).to.equal(true)
      result = await execute(`add:resource api/v1/libros --force`)
      // console.log(result)
      expect(result.includes('adicionado exitosamente')).to.equal(true)
      verifyDir('src/modules/API/resources/api/v1/libros')
    })

    it('Comando add:route --resource', async () => {
      const result = await execute(`add:route obtener --resource api/v1/libros`)
      // console.log(result)
      expect(result.includes('adicionada exitosamente')).to.equal(true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js', 'ROUTE.obtener', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.input.js', 'INPUT.obtener', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.output.js', 'OUTPUT.obtener', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.middleware.js', 'MIDDLEWARE.obtener', true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.controller.js', 'CONTROLLER.obtener', true)

      verifyFile('src/modules/API/resources/api/v1/libros/libros.output.js', 'Field.group(app.API.models', false)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.output.js', 'Field.group(null', true)

      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js', `path        : '/api/v1/libros/obtener'`, true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js', `method      : 'get'`, true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js', `version     : 1`, true)
      verifyFile('src/modules/API/resources/api/v1/libros/libros.route.js', `description : ''`, true)
    })

    it('Comando add:route --resource --path --model --method --route-version --description', async () => {
      let result = await execute(`add:resource abcd`)
      // console.log(result)
      result = await execute(`add:route crear --resource abcd --path /custom/path --model libro --method post --route-version 3 --description "ABCD"`)
      // console.log(result)
      expect(result.includes('adicionada exitosamente')).to.equal(true)
      verifyFile('src/modules/API/resources/abcd/abcd.route.js', 'ROUTE.crear', true)
      verifyFile('src/modules/API/resources/abcd/abcd.input.js', 'INPUT.crear', true)
      verifyFile('src/modules/API/resources/abcd/abcd.output.js', 'OUTPUT.crear', true)
      verifyFile('src/modules/API/resources/abcd/abcd.middleware.js', 'MIDDLEWARE.crear', true)
      verifyFile('src/modules/API/resources/abcd/abcd.controller.js', 'CONTROLLER.crear', true)

      verifyFile('src/modules/API/resources/abcd/abcd.output.js', 'Field.group(app.API.models', true)
      verifyFile('src/modules/API/resources/abcd/abcd.output.js', 'Field.group(null', false)

      verifyFile('src/modules/API/resources/abcd/abcd.route.js', `path        : '/custom/path'`, true)
      verifyFile('src/modules/API/resources/abcd/abcd.route.js', `method      : 'post'`, true)
      verifyFile('src/modules/API/resources/abcd/abcd.route.js', `version     : 3`, true)
      verifyFile('src/modules/API/resources/abcd/abcd.route.js', `description : 'ABCD'`, true)
    })

    it('Comando gen:resource --model', async () => {
      const result = await execute(`gen:resource api/v2/libros --model libro`)
      // console.log(result)
      expect(result.includes('generado exitosamente')).to.equal(true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.route.js')
      verifyFile('src/modules/API/resources/api/v2/libros/libros.input.js')
      verifyFile('src/modules/API/resources/api/v2/libros/libros.output.js')
      verifyFile('src/modules/API/resources/api/v2/libros/libros.middleware.js')
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js')

      verifyFile('src/modules/API/resources/api/v2/libros/libros.route.js', `version     : 2`, true)

      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.get', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.getId', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.create', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.update', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.destroy', true)
      verifyFile('src/modules/API/resources/api/v2/libros/libros.controller.js', 'CONTROLLER.restore', true)
    })

    it('Comando gen:resource --model --force', async () => {
      let result = await execute(`gen:resource api/v2/libros --model libro`)
      // console.log(result)
      expect(result.includes(`Ya existe el recurso 'api/v2/libros'`)).to.equal(true)
      result = await execute(`gen:resource api/v2/libros --model libro --force`)
      // console.log(result)
      expect(result.includes('generado exitosamente')).to.equal(true)
      verifyDir('src/modules/API/resources/api/v2/libros')
    })

    it('Comando gen:resource --model --output-depth --type --resource-version', async () => {
      const result = await execute(`gen:resource api/v3/libros --model libro --output-depth 1 --type get,create --resource-version 5`)
      // console.log(result)
      expect(result.includes('generado exitosamente')).to.equal(true)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js')
      verifyFile('src/modules/API/resources/api/v3/libros/libros.input.js')
      verifyFile('src/modules/API/resources/api/v3/libros/libros.output.js')
      verifyFile('src/modules/API/resources/api/v3/libros/libros.middleware.js')
      verifyFile('src/modules/API/resources/api/v3/libros/libros.controller.js')

      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', `version     : 5`, true)

      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.get', true)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.getId', false)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.create', true)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.update', false)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.destroy', false)
      verifyFile('src/modules/API/resources/api/v3/libros/libros.route.js', 'ROUTE.restore', false)
    })

    it('Prueba la instalación del servicio', async () => {
      updateDatabaseConfig()
      clearEnv()
      process.env.LISTEN = 'false'
      const result = await util.cmd(`npm run setup`, workspacePath).catch(e => {
        console.log(e)
      })
      expect(result.includes(`La aplicación ha sido instalada con éxito.`)).to.equal(true)
    })

    it('Prueba la ejecución del servicio', async () => {
      updateDatabaseConfig()
      clearEnv()
      process.env.LISTEN = 'false'
      const result = await util.cmd(`npm run start`, workspacePath).catch(e => {
        console.log(e)
      })
      expect(result.includes(`La aplicación ha sido cargada con éxito.`)).to.equal(true)
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
  delete process.env.LISTEN
}
