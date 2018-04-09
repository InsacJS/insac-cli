const util = require(insac).util

// |=============================================================|
// |-------------- CONSTANTES -----------------------------------|
// |=============================================================|

// util.INTEGER_MAX_VALUE = 2147483647

// |=============================================================|
// |-------------- VARIOS ---------------------------------------|
// |=============================================================|

// util.find      = (dirPath, ext, onFind) => {}   : void
// util.findAsync = (dirPath, ext, onFind) => {}   : Promise
// util.timer     = (timeout)              => {}   : Promise
// util.cmd       = (command, executePath) => {}   : Promise
// util.json      = (data)                 => {}   : String
// util.log       = (data)                 => {}   : void
// util.obj       = (data, properties)     => {}   : Object
// util.array     = (data, property)       => {}   : Array
// util.random    = (a, b)                 => {}   : Number

// |=============================================================|
// |-------------- DIRECTORIOS ----------------------------------|
// |=============================================================|

// util.isDir = (dirPath) => {}   : Boolean
// util.mkdir = (dirPath) => {}   : void
// util.rmdir = (dirPath) => {}   : void

// |=============================================================|
// |-------------- ARCHIVOS -------------------------------------|
// |=============================================================|

// util.isFile     = (filePath)               => {}   : Boolean
// util.readFile   = (filePath)               => {}   : String
// util.writeFile  = (filePath, content)      => {}   : void
// util.removeFile = (filePath)               => {}   : void
// util.copyFile   = (sourcePath, targetPath) => {}   : void

// |=============================================================|
// |-------------- FILTROS Y CONSULTAS --------------------------|
// |=============================================================|

// util.metadata = (req, result) => {}   : Object

// |=============================================================|
// |-------------- AUTENTICACIÓN --------------------------------|
// |=============================================================|

// util.md5          = (str)                                                => {}   : String
// util.createToken  = (data, privateKey, exp = 86400, algorithm = 'RS256') => {}   : String
// util.decodeToken  = (token, publicKey)                                   => {}   : String
// util.encodeBase64 = (str)                                                => {}   : String
// util.decodeBase64 = (str)                                                => {}   : String

// |=============================================================|
// |-------------- PERSONALIZADOS -------------------------------|
// |=============================================================|

module.exports = util
