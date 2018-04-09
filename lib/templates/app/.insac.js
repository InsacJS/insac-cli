// |=============================================================|
// |---------- CONFIGURACIÓN DEL FORMATO DE RESPUESTA -----------|
// |=============================================================|

exports.RESPONSE = {
  successFormat: (result) => {
    const RESULT = {
      status  : result.status,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  },
  errorFormat: (result) => {
    return {
      status  : result.status,
      message : result.message,
      errors  : result.errors
    }
  }
}

// |=============================================================|
// |---------- CONFIGURACIÓN PARA EL APIDOC ---------------------|
// |=============================================================|

exports.APIDOC = {
  name    : '',
  title   : 'Apidoc',
  version : '1.0.0',
  header  : { title: 'INICIO', filename: 'HEADER.md' },
  footer  : null
}
