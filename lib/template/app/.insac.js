'use strict'

const pack = require('./package.json')

module.exports = {
  database: {
    development: {
      name: 'insac_development',
    },
    test: {
      name: 'insac_test',
    },
    production: {
      name: 'insac_production',
    },
    username: 'postgres',
    password: '12345678'
  },
  server: {
    all200: false
  },
  auth: {
    token: {
      key: 'CLAVE_SECRETA'
    },
    roles: [
      {id:1, nombre:'Administrativo', alias:'admin', peso:10}
    ]
  },
  apidoc: {
    name: pack.name,
    version: pack.version,
    description: pack.description,
    title: `Apidoc · ${pack.name}`,
    url: "http://localhost:7000"
  }
}
