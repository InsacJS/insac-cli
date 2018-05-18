const chai = require('chai')

global.insac = '/home/alex/insac/project/insac'

// SERVER
process.env.NODE_ENV = 'test'
process.env.PORT     = 4001

// DATABASE
process.env.DB_USER      = 'postgres'
process.env.DB_PASS      = 'postgres'
process.env.DB_NAME      = 'postgres'
process.env.DB_HOST_NAME = '127.0.0.1'
process.env.DB_HOST_PORT = '5432'

global.expect = chai.expect
