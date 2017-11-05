'use strict'
const { Insac } = require('insac')

// Crea la aplicación
let app = module.exports = new Insac()

// Carga los modelos, middlewares, recursos y rutas.
app.load()

// Ejecuta la aplicación
app.listen()
