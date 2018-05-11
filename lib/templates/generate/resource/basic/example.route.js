module.exports = (data) => {
  const group = data.GROUP

  const TYPE    = data.ROUTE_TYPE.split(',')
  const GET     = TYPE.includes('get')
  const GET_ID  = TYPE.includes('getId')
  const CREATE  = TYPE.includes('create')
  const UPDATE  = TYPE.includes('update')
  const DESTROY = TYPE.includes('destroy')
  const RESTORE = TYPE.includes('restore')

  let pk
  Object.keys(data.model.attributes).forEach(key => {
    const FIELD = data.model.attributes[key]
    const isPk  = FIELD.primaryKey === true
    if (isPk) { pk = key }
  })

  let _r = ''

  _r += `module.exports = (app) => {
  const ROUTE = {}\n\n`

  if (GET) {
    _r += `  ROUTE.get = {
    path        : '/${group}',
    method      : 'get',
    description : 'Devuelve una lista de registros.'
  }\n\n`
  }

  if (GET_ID) {
    _r += `  ROUTE.getId = {
    path        : '/${group}/:${pk}',
    method      : 'get',
    description : 'Devuelve un registro por ID.'
  }\n\n`
  }

  if (CREATE) {
    _r += `  ROUTE.create = {
    path        : '/${group}',
    method      : 'post',
    description : 'Crea un nuevo registro.'
  }\n\n`
  }

  if (UPDATE) {
    _r += `  ROUTE.update = {
    path        : '/${group}/:${pk}',
    method      : 'put',
    description : 'Modifica un registro por ID.'
  }\n\n`
  }

  if (DESTROY) {
    _r += `  ROUTE.destroy = {
    path        : '/${group}/:${pk}',
    method      : 'delete',
    description : 'Elimina un registro por ID.'
  }\n\n`
  }

  if (RESTORE) {
    _r += `  ROUTE.restore = {
    path        : '/${group}/:${pk}/restore',
    method      : 'put',
    description : 'Restaura un usuario eliminado por ID.'
  }\n\n`
  }

  _r += `  // <!-- [CLI] - [COMPONENT] --!> //

  return ROUTE
}
`
  return _r
}
