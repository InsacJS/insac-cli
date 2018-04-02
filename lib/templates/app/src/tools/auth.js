const auth = require(insac).auth

// |=============================================================|
// |-------------- FUNCIONES PREDEFINIDAS -----------------------|
// |=============================================================|

// auth.md5          = (str)                                                => {}   : String
// auth.createToken  = (data, privateKey, exp = 86400, algorithm = 'RS256') => {}   : String
// auth.decodeToken  = (token, publicKey)                                   => {}   : String
// auth.encodeBase64 = (str)                                                => {}   : String
// auth.decodeBase64 = (str)                                                => {}   : String

// |=============================================================|
// |-------------- PERSONALIZADOS -------------------------------|
// |=============================================================|

module.exports = auth
