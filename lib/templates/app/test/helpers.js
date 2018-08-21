const chai = require('chai')

// SERVER
process.env.NODE_ENV = 'test'
process.env.PORT     = 4001

// DATABASE
process.env.DB_USER = 'postgres'
process.env.DB_PASS = 'postgres'
process.env.DB_NAME = '_example'
process.env.DB_HOST = '127.0.0.1'
process.env.DB_PORT = '5432'
process.env.DIALECT = 'postgres'

global.expect = chai.expect
