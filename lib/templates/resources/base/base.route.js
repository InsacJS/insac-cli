module.exports = (data) => {
  const group  = data.GROUP

  let pk
  Object.keys(data.model.attributes).forEach(key => {
    const FIELD = data.model.attributes[key]
    const isPk  = FIELD.primaryKey === true
    if (isPk) { pk = key }
  })

  const _r = `module.exports = (app) => {
  const ROUTE = {}

  ROUTE.listar = {
    path        : '/${group}',
    method      : 'get',
    description : 'Devuelve una lista de registros.'
  }

  ROUTE.obtener = {
    path        : '/${group}/:${pk}',
    method      : 'get',
    description : 'Devuelve un registro por ID.'
  }

  ROUTE.crear = {
    path        : '/${group}',
    method      : 'post',
    description : 'Crea un nuevo registro.'
  }

  ROUTE.actualizar = {
    path        : '/${group}/:${pk}',
    method      : 'put',
    description : 'Modifica un registro por ID.'
  }

  ROUTE.eliminar = {
    path        : '/${group}/:${pk}',
    method      : 'delete',
    description : 'Elimina un registro por ID.'
  }

  ROUTE.restaurar = {
    path        : '/${group}/:${pk}/restaurar',
    method      : 'put',
    description : 'Restaura un usuario eliminado por ID.'
  }

  // <!-- [CLI] - [ROUTE] --!> //

  return ROUTE
}
`
  return _r
}
